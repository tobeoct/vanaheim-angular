import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import moment = require('moment');
import { BehaviorSubject, combineLatest, EMPTY, from, Observable, timer } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, mergeMap, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Utility } from '../../helpers/utility.service';
const POLLING_INTERVAL = 10000;
export enum EarningType {
  EndOfTenor = "End Of Tenor",
  Monthly = "Monthly ROI"
}
@Injectable({
  providedIn: 'root'
})
export class AdminEarningService {
  containers: any[] = [{ title: "NEW", indicator: "new", totalCount: 0, data: [] },
  { title: "PROCESSING", indicator: "processing", totalCount: 0, data: [] },
  //  { title: "DECLINED", indicator: "declined", totalCount: 0, data: [] }, 
  { title: "ACTIVE", indicator: "active", totalCount: 0, data: [] },
  { title: "MATURED", indicator: "matured", disabled: true, totalCount: 0, data: [] }]
  updateSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  update$: Observable<any> = this.updateSubject.asObservable();
  requestsSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  requestsFromDb$: Observable<any> = this.requestsSubject.asObservable();
  requests$: Observable<any>;
  topUps$: Observable<any>;
  liquidations$: Observable<any>;
  earningDetails$: Observable<any>;
  allEarningDetails$: Observable<any>;
  allEarningLogDetails$: Observable<any>;
  // earningLogDetails$:Observable<any>;
  filteredRequests$: Observable<any>;
  pagingSubject: BehaviorSubject<any> = new BehaviorSubject<any>({ pageNumber: 1, maxSize: 100 });
  paging$: Observable<any> = this.pagingSubject.asObservable();


  searchSubject: BehaviorSubject<any> = new BehaviorSubject<any>({ from: moment().startOf("day").subtract(1, "month").toDate(), to: moment().endOf("day").toDate() });
  search$: Observable<any> = this.searchSubject.asObservable();

  selectedIdSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  selectedId$: Observable<number> = this.selectedIdSubject.asObservable();
  selectedLogIdSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  selectedLogId$: Observable<number> = this.selectedLogIdSubject.asObservable();

  // earningLogDetailsSubject:BehaviorSubject<any> = new BehaviorSubject<any>({});
  earningLogDetails$: Observable<any>; //= this.earningLogDetailsSubject.asObservable();
  constructor(private _http: HttpClient, private _utils: Utility) {
    this.pollRequests()
    this.earningDetails$ = this.selectedId$.pipe(distinctUntilChanged(), mergeMap((id) => this.getEarningDetails(id)), shareReplay(1),
      map(value => ({ id: this.selectedIdSubject.value, ...value })),
      catchError(err => {
        console.error(err);
        return EMPTY;
      })
    );
    this.earningLogDetails$ =
      this.selectedLogId$.pipe(distinctUntilChanged(), mergeMap((id) => this.getEarningDetails(id, "log").pipe(catchError(err => {
        console.error(err);
        return EMPTY;
      }))),
        map(value => ({ id: this.selectedIdSubject.value, ...value })),
      )//.subscribe(c=>this.earningLogDetailsSubject.next(c));

    this.allEarningDetails$ = this.selectedId$.pipe(distinctUntilChanged(), mergeMap((id) => this.getAllEarningDetails()), shareReplay(1),
      map(value => ({ id: this.selectedIdSubject.value, ...value })),
      catchError(err => {
        console.error(err);
        return EMPTY;
      })
    );
    this.allEarningLogDetails$ =
      this.selectedLogId$.pipe(distinctUntilChanged(), mergeMap((id) => this.getAllEarningDetails("log").pipe(catchError(err => {
        console.error(err);
        return EMPTY;
      }))),
        map(value => ({ id: this.selectedIdSubject.value, ...value })),
      )//.subscribe(c=>this.earningLogDetailsSubject.next(c));


    this.filteredRequests$ = combineLatest([
      this.search$,
      this.paging$
    ])
      .pipe(mergeMap(([search, paging]: any) => this.searchForAdmin({ ...paging, ...search })), shareReplay(1),
        map(requests => requests.rows), map((requests: any[]) => {

          const newRequests = requests.filter((c: any) => c.requestStatus == "Pending");
          const procRequests = requests.filter((c: any) => c.requestStatus == "Processing");
          // const updateRequests = requests.filter((c: any) => c.requestStatus == "UpdateRequired");
          // const declinedRequests = requests.filter((c: any) => c.requestStatus == "Declined");
          const activeRequests = requests.filter((c: any) => c.requestStatus == "Active");
          const maturedRequests = requests.filter((c: any) => c.requestStatus == "Matured");
          return [{ title: "NEW", indicator: "new", totalCount: newRequests.length, data: newRequests },
          { title: "PROCESSING", indicator: "processing", totalCount: procRequests.length, data: procRequests },
          // { title: "DECLINED", indicator: "declined", totalCount: declinedRequests.length, data: declinedRequests }, 
          { title: "ACTIVE", indicator: "active", totalCount: activeRequests.length, data: activeRequests },
          { title: "MATURED", indicator: "matured", disabled: true, totalCount: maturedRequests.length, data: maturedRequests }];
        }),
        catchError(err => {
          console.error(err);
          return EMPTY;
        })
      );


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

  pollRequests() {
    timer(0, POLLING_INTERVAL).subscribe(c => {
      this.searchSubject.next({ from: moment().startOf("day").subtract(1, "month").toDate(), to: moment().endOf("day").toDate() })
      this.selectedIdSubject.next(0)
    })
  }

  updateSearch({ from, to }: any) {
    this.searchSubject.next({ from, to });
  }

  getStatus(classList: any) {
    let value = classList.value ?? classList;
    if (value.toLowerCase().includes("active")) return "Active";
    if (value.toLowerCase().includes("processing")) return "Processing";
    // if (value.toLowerCase().includes("update")) return "UpdateRequired";
    if (value.toLowerCase().includes("decline")) return "Declined";
    if (value.toLowerCase().includes("matured")) return "Matured";
    return "New";
  }
  searchForAdmin = (payload: any) => {
    return this._http.post<any>(`${environment.apiUrl}/earnings/searchToProcess`, { ...payload })
      .pipe(map(response => {
        if (response && response.status == true) {
          return response.response;
        }
        return {};
      }));
  }
  updateStatus = (id: number, status: string, failureReason: string, message: string, startDate: any, serialNumber: any) => {
    return this._http.post<any>(`${environment.apiUrl}/earnings/updateStatus`, { id, status, failureReason, message, startDate, serialNumber })
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
  selectEarning(id: number) {
    this.selectedIdSubject.next(id);
  }
  selectEarningLog(id: number) {
    this.selectedLogIdSubject.next(id);
  }
  getEarningDetails = (id: number, type?: string) => {
    if (!id) return EMPTY;
    this._utils.toggleLoading(true);
    const url = !type ? `${environment.apiUrl}/earnings/getEarningDetails?id=${id}` : `${environment.apiUrl}/earnings/getEarningLogDetails?id=${id}`;
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
  getTopUps = (status: any = 'Pending', pageNumber: number = 1, maxSize: number = 10) => {
    const url = `${environment.apiUrl}/earnings/getTopUps?status=${status}&pageNumber=${pageNumber}&maxSize=${maxSize}`;
    return timer(0, POLLING_INTERVAL)
      .pipe(switchMap(() => this._http.get<any>(url)
        .pipe(map(response => {
          if (response && response.status == true) {
            return Object.keys(response.response).length > 0 ? response.response : null;
          }
          return null;
        }), catchError(err => {
          console.error(err);
          return EMPTY;
        }))),
        // shareReplay({bufferSize:1, refCount:true})
        catchError(err => {
          console.error(err);
          return EMPTY;
        })
      )
  }
  getLiquidations = (status?: any, pageNumber: number = 1, maxSize: number = 10) => {
    const url = !status ? `${environment.apiUrl}/earnings/getLiquidations?pageNumber=${pageNumber}&maxSize=${maxSize}` : `${environment.apiUrl}/earnings/getLiquidations?status=${status}&pageNumber=${pageNumber}&maxSize=${maxSize}`;
    return timer(0, POLLING_INTERVAL)
      .pipe(switchMap(() => this._http.get<any>(url)
        .pipe(map(response => {
          if (response && response.status == true) {
            return Object.keys(response.response).length > 0 ? response.response : null;
          }
          return null;
        }), catchError(err => {
          console.error(err);
          return EMPTY;
        }))),
        // shareReplay({bufferSize:1, refCount:true})
        catchError(err => {
          console.error(err);
          return EMPTY;
        })
      )
  }


  topUp = (topUpId: number) => {
    const url = `${environment.apiUrl}/earnings/topUp?id=${topUpId}`;
    return this._http.patch<any>(url, null)
      .pipe(map(response => {
        if (response && response.status == true) {
          return response.response;
        }
        return {};
      }));
  }
  liquidate = (topUpId: number, status?: string) => {
    const url = `${environment.apiUrl}/earnings/liquidate?id=${topUpId}&status=${status}`;
    return this._http.patch<any>(url, null)
      .pipe(map(response => {
        if (response && response.status == true) {
          return response.response;
        }
        return {};
      }));
  }

  getAllEarningDetails = (type?: string) => {
    const url = !type ? `${environment.apiUrl}/earnings/getAllEarningDetails` : `${environment.apiUrl}/earnings/getEarningAllLogDetails`;
    return this._http.get<any>(url)
      .pipe(map(response => {
        if (response && response.status == true) {
          return response.response;
        }
        return {};
      }));
  }
}
