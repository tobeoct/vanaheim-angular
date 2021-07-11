import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import moment = require('moment');
import { BehaviorSubject, combineLatest, EMPTY, Observable } from 'rxjs';
import { catchError, combineAll, distinctUntilChanged, map, mergeMap, shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequestService  {
  containers:any[] = [{title:"NEW",indicator:"new",totalCount:0,data:[]},{title:"PROCESSING",indicator:"processing",totalCount:0,data:[]},{title:"UPDATE REQUIRED",indicator:"update",totalCount:0,data:[]},{title:"DECLINED",indicator:"declined",totalCount:0,data:[]},{title:"APPROVED",indicator:"approved",totalCount:0,data:[]},{title:"FUNDED",indicator:"funded",disabled:true,totalCount:0,data:[]}]
  updateSubject:BehaviorSubject<any> = new BehaviorSubject<any>({});
  update$:Observable<any> = this.updateSubject.asObservable();
  requestsSubject:BehaviorSubject<any> = new BehaviorSubject<any>([]);
  requestsFromDb$:Observable<any> = this.requestsSubject.asObservable();
  requests$:Observable<any>;
  loanDetails$:Observable<any>;
  filteredRequests$:Observable<any>;
pagingSubject:BehaviorSubject<any> = new BehaviorSubject<any>({pageNumber:1,maxSize:100}); 
paging$:Observable<any> = this.pagingSubject.asObservable();


searchSubject:BehaviorSubject<any> = new BehaviorSubject<any>({from:moment().startOf("day").subtract(1,"month").toDate(),to:moment().endOf("day").toDate()}); 
search$:Observable<any> = this.searchSubject.asObservable();

  selectedIdSubject:BehaviorSubject<number> = new BehaviorSubject<number>(0);
  selectedId$:Observable<number> = this.selectedIdSubject.asObservable();
  constructor(private _http: HttpClient) {
    this.loanDetails$ = this.selectedId$.pipe(mergeMap((id) =>this.getLoanDetails(id)),shareReplay(1),tap(console.log),
    map(value=>value), 
    catchError(err => {
        console.error(err);
        return EMPTY;
      })
      );

      
      this.filteredRequests$= combineLatest([
        this.search$,
        this.paging$
      ])
        .pipe(mergeMap(([search,paging]:any) =>  this.searchForAdmin({...paging,...search})),shareReplay(1),
        map(requests=>requests.rows),map((requests:any[])=>{
    
          const newRequests =requests.filter((c:any)=>c.requestStatus=="Pending");
        const procRequests =requests.filter((c:any)=>c.requestStatus=="Processing");
        const updateRequests =requests.filter((c:any)=>c.requestStatus=="UpdateRequired");
        const declinedRequests =requests.filter((c:any)=>c.requestStatus=="NotQualified");
        const approvedRequests =requests.filter((c:any)=>c.requestStatus=="Approved");
        const fundedRequests =requests.filter((c:any)=>c.requestStatus=="Funded");
        return [{title:"NEW",indicator:"new",totalCount:newRequests.length,data:newRequests},{title:"PROCESSING",indicator:"processing",totalCount:procRequests.length,data:procRequests},{title:"UPDATE REQUIRED",indicator:"update",totalCount:updateRequests.length,data:updateRequests},{title:"DECLINED",indicator:"declined",totalCount:declinedRequests.length,data:declinedRequests},{title:"APPROVED",indicator:"approved",totalCount:approvedRequests.length,data:approvedRequests},{title:"FUNDED",indicator:"funded",disabled:true,totalCount:fundedRequests.length,data:fundedRequests}];
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

  this.requests$ = combineLatest([this.filteredRequests$,this.update$]).pipe(map(([requests,updated])=>{
    if(!requests || Object.keys(requests).length==0) return this.containers;
    if(updated && Object.keys(updated).length>0){
      const {from,to} = updated;
  requests = requests.map((r:any)=>{
    if(to.value.includes(r.title)){
      r.totalCount+=1;
    }
    if(from.value.includes(r.title)){
      r.totalCount-=1;
    }
    return r;
  })
    }
    return requests;
  }))



   }

   updateSearch({from,to}:any){
    this.searchSubject.next({from,to});
   }
   
  getStatus(classList:any){
    if(classList.value.includes("APPROVED")) return "Approved";
    if(classList.value.includes("PROCESSING")) return "Processing";
    if(classList.value.includes("UPDATE")) return "UpdateRequired";
    if(classList.value.includes("DECLINED")) return "NotQualified";
    if(classList.value.includes("FUNDED")) return "Funded";
    return "Pending";
  }
  searchForAdmin=(payload:any)=>{
    return this._http.post<any>(`${environment.apiUrl}/loans/searchToProcess`, {...payload})
    .pipe(map(response => {
        if(response && response.status==true){
           return response.response;
        }
        return {};
    }));
  }
  updateStatus=(id:number,status:string)=>{
    return this._http.post<any>(`${environment.apiUrl}/loans/updateStatus`, {id,status})
    .pipe(map(response => {
        if(response && response.status==true){
           return response.response;
        }
        return {};
    })).toPromise();
  }

  getCustomer=(id:any)=>{
    return this._http.get<any>(`${environment.apiUrl}/customer/getById?id=${id}`)
    .pipe(map(response => {
        if(response && response.status==true){
           return response.response;
        }
        return {};
    }), distinctUntilChanged()).toPromise();
  }

  updaterequests(requests:any){
    this.updateSubject.next(requests)
  }
  selectLoan(id:number){
    this.selectedIdSubject.next(id);
  }
  getLoanDetails=(id:number)=>{
    return this._http.get<any>(`${environment.apiUrl}/loans/getLoanDetails?id=${id}`)
    .pipe(map(response => {
        if(response && response.status==true){
           return response.response;
        }
        return {};
    }));
  }
}
