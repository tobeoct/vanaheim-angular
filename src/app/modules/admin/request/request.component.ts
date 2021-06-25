import { Component, OnInit } from '@angular/core';
import { request } from 'express';
import { Observable, of } from 'rxjs';
import { map, switchMap, toArray } from 'rxjs/operators';
import { LoanService } from 'src/app/shared/services/loan/loan.service';
import { RequestService } from './request.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {
  loans$:Observable<any[]>
  constructor(private _requestService: RequestService, private _loanService:LoanService) { }

  ngOnInit(): void {
      // this._requestService.fetchToken()
      this.loans$ = this._requestService.loansForAdmin$.pipe(map(requests=>requests.rows),map((requests:any[])=>{
        const newRequests =requests.filter((c:any)=>c.requestStatus=="Pending");
        const procRequests =requests.filter((c:any)=>c.requestStatus=="Processing");
        const updateRequests =requests.filter((c:any)=>c.requestStatus=="UpdateRequired");
        const declinedRequests =requests.filter((c:any)=>c.requestStatus=="NotQualified");
        const approvedRequests =requests.filter((c:any)=>c.requestStatus=="Approved");
        return [{title:"NEW",indicator:"new",totalCount:newRequests.length,data:newRequests},{title:"PROCESSING",indicator:"processing",totalCount:procRequests.length,data:procRequests},{title:"UPDATE REQUIRED",indicator:"update",totalCount:updateRequests.length,data:updateRequests},{title:"DECLINED",indicator:"declined",totalCount:declinedRequests.length,data:declinedRequests},{title:"APPROVED",indicator:"approved",totalCount:approvedRequests.length,data:approvedRequests}]
      }));

      // this.loans$ = of([{title:"NEW",indicator:"new",totalCount:0,data:[]},{title:"PROCESSING",indicator:"processing",totalCount:0,data:[]},{title:"UPDATE REQUIRED",indicator:"update",totalCount:0,data:[]},{title:"DECLINED",indicator:"declined",totalCount:0,data:[]},{title:"APPROVED",indicator:"approved",totalCount:0,data:[]}])
    
  }

}
