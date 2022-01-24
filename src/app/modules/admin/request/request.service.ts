import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import moment = require('moment');
import { BehaviorSubject, combineLatest, EMPTY, Observable } from 'rxjs';
import { catchError, combineAll, distinctUntilChanged, map, mergeMap, shareReplay, tap } from 'rxjs/operators';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { DisbursedLoanService } from 'src/app/shared/services/loan/disbursedLoan/disbursed-loan.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  containers: any[] = [{ title: "NEW", indicator: "new", totalCount: 0, data: [] }, { title: "PROCESSING", indicator: "processing", totalCount: 0, data: [] }, { title: "UPDATE REQUIRED", indicator: "update", totalCount: 0, data: [] }, { title: "DECLINED", indicator: "declined", totalCount: 0, data: [] }, { title: "APPROVED", indicator: "approved", totalCount: 0, data: [] }, { title: "FUNDED", indicator: "funded", disabled: true, totalCount: 0, data: [] }]
  updateSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  update$: Observable<any> = this.updateSubject.asObservable();
  requestsSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  requestsFromDb$: Observable<any> = this.requestsSubject.asObservable();
  requests$: Observable<any>;
  loanDetails$: Observable<any>;
  // loanLogDetails$:Observable<any>;
  filteredRequests$: Observable<any>;
  pagingSubject: BehaviorSubject<any> = new BehaviorSubject<any>({ pageNumber: 1, maxSize: 100 });
  paging$: Observable<any> = this.pagingSubject.asObservable();


  searchSubject: BehaviorSubject<any> = new BehaviorSubject<any>({ from: moment().startOf("day").subtract(1, "month").toDate(), to: moment().endOf("day").toDate() });
  search$: Observable<any> = this.searchSubject.asObservable();

  selectedIdSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  selectedId$: Observable<number> = this.selectedIdSubject.asObservable();
  selectedLogIdSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  selectedLogId$: Observable<number> = this.selectedLogIdSubject.asObservable();

  // loanLogDetailsSubject:BehaviorSubject<any> = new BehaviorSubject<any>({});
  loanLogDetails$: Observable<any>; //= this.loanLogDetailsSubject.asObservable();
  constructor(private _http: HttpClient, private _disbursedLoanService: DisbursedLoanService, private _utils: Utility) {
    this.loanDetails$ = this.selectedId$.pipe(distinctUntilChanged(), mergeMap((id) => this.getLoanDetails(id)), shareReplay(1),
      map(value => ({ id: this.selectedIdSubject.value, ...value })),
      catchError(err => {
        console.error(err);
        return EMPTY;
      })
    );
    this.loanLogDetails$ =
      this.selectedLogId$.pipe(distinctUntilChanged(), mergeMap((id) => this.getLoanDetails(id, "log").pipe(catchError(err => {
        console.error(err);
        return EMPTY;
      }))),
        map(value => ({ id: this.selectedIdSubject.value, ...value })),
      )//.subscribe(c=>this.loanLogDetailsSubject.next(c));


    this.filteredRequests$ = combineLatest([
      this.search$,
      this.paging$
    ])
      .pipe(mergeMap(([search, paging]: any) => this.searchForAdmin({ ...paging, ...search })), shareReplay(1),
        map(requests => requests.rows), map((requests: any[]) => {

          const newRequests = requests.filter((c: any) => c.requestStatus == "Pending");
          const procRequests = requests.filter((c: any) => c.requestStatus == "Processing");
          const updateRequests = requests.filter((c: any) => c.requestStatus == "UpdateRequired");
          const declinedRequests = requests.filter((c: any) => c.requestStatus == "NotQualified");
          const approvedRequests = requests.filter((c: any) => c.requestStatus == "Approved");
          const fundedRequests = requests.filter((c: any) => c.requestStatus == "Funded");
          return [{ title: "NEW", indicator: "new", totalCount: newRequests.length, data: newRequests }, { title: "PROCESSING", indicator: "processing", totalCount: procRequests.length, data: procRequests }, { title: "UPDATE REQUIRED", indicator: "update", totalCount: updateRequests.length, data: updateRequests }, { title: "DECLINED", indicator: "declined", totalCount: declinedRequests.length, data: declinedRequests }, { title: "APPROVED", indicator: "approved", totalCount: approvedRequests.length, data: approvedRequests }, { title: "FUNDED", indicator: "funded", disabled: true, totalCount: fundedRequests.length, data: fundedRequests }];
        }),
        catchError(err => {
          console.error(err);
          return EMPTY;
        })
      );
    //   this.requestsFromDb$ = this.searchForAdmin({pageNumber:1,maxSize:100}).pipe(map(requests=>requests.rows),map((requests:any[])=>{

    //     const newRequests =requests.filter((c:any)=>c.requestStatus=="Pending");
    //   const procRequests =requests.filter((c:any)=>c.requestStatus=="Processing");
    //   const updateRequests =requests.filter((c:any)=>c.requestStatus=="UpdateRequired");
    //   const declinedRequests =requests.filter((c:any)=>c.requestStatus=="NotQualified");
    //   const approvedRequests =requests.filter((c:any)=>c.requestStatus=="Approved");
    //   const fundedRequests =requests.filter((c:any)=>c.requestStatus=="Funded");
    //   return [{title:"NEW",indicator:"new",totalCount:newRequests.length,data:newRequests},{title:"PROCESSING",indicator:"processing",totalCount:procRequests.length,data:procRequests},{title:"UPDATE REQUIRED",indicator:"update",totalCount:updateRequests.length,data:updateRequests},{title:"DECLINED",indicator:"declined",totalCount:declinedRequests.length,data:declinedRequests},{title:"APPROVED",indicator:"approved",totalCount:approvedRequests.length,data:approvedRequests},{title:"FUNDED",indicator:"funded",disabled:true,totalCount:fundedRequests.length,data:fundedRequests}];
    // }));

    this.requests$ = combineLatest([this.filteredRequests$, this.update$]).pipe(map(([requests, updated]) => {
      if (!requests || Object.keys(requests).length == 0) return this.containers;
      if (updated && Object.keys(updated).length > 0) {
        const { from, to } = updated;
        requests = requests.map((r: any) => {
          if (to.value.includes(r.title)) {
            r.totalCount += 1;
          }
          if (from.value.includes(r.title)) {
            r.totalCount -= 1;
          }
          return r;
        })
      }
      return requests;
    }))



  }

  updateSearch({ from, to }: any) {
    this.searchSubject.next({ from, to });
  }

  getStatus(classList: any) {
    let value = classList.value ?? classList;
    if (value.toLowerCase().includes("approved")) return "Approved";
    if (value.toLowerCase().includes("processing")) return "Processing";
    if (value.toLowerCase().includes("update")) return "UpdateRequired";
    if (value.toLowerCase().includes("decline")) return "NotQualified";
    if (value.toLowerCase().includes("funded")) return "Funded";
    return "New";
  }
  searchForAdmin = (payload: any) => {
    return this._http.post<any>(`${environment.apiUrl}/loans/searchToProcess`, { ...payload })
      .pipe(map(response => {
        if (response && response.status == true) {
          return response.response;
        }
        return {};
      }));
  }
  updateStatus = (id: number, status: string, failureReason: string, message: string, serialNumber?: string) => {
    return this._http.post<any>(`${environment.apiUrl}/loans/updateStatus`, { id, status, failureReason, message, serialNumber })
      .pipe(map(response => {
        if (response && response.status == true) {
          return response.response;
        }
        return {};
      })).toPromise();
  }


  getCustomer = (id: any) => {
    return this._http.get<any>(`${environment.apiUrl}/customer/getById?id=${id}`)
      .pipe(map(response => {
        if (response && response.status == true) {
          return response.response;
        }
        return {};
      }), distinctUntilChanged()).toPromise();
  }

  updaterequests(requests: any) {
    this.updateSubject.next(requests)
  }
  selectLoan(id: number) {
    this.selectedIdSubject.next(id);
  }
  selectLoanLog(id: number) {
    this.selectedLogIdSubject.next(id);
  }
  getLoanDetails = (id: number, type?: string) => {

    if (id == 0) return EMPTY;
    this._utils.toggleLoading(true);
    const url = !type ? `${environment.apiUrl}/loans/getLoanDetails?id=${id}` : `${environment.apiUrl}/loans/getLoanLogDetails?id=${id}`;
    return this._http.get<any>(url)
      .pipe(map(response => {
        this._utils.toggleLoading(false);
        if (response && response.status == true) {
          return response.response;
        }
        return {};
      }), catchError(err => {

        this._utils.toggleLoading(false);
        console.error(err);
        return EMPTY;
      }));
  }
}
