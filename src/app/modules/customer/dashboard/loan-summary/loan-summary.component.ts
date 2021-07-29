import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import moment = require('moment');
import { BehaviorSubject, Observable } from 'rxjs';
import { RequestService } from 'src/app/modules/admin/request/request.service';
import { LoanService } from 'src/app/shared/services/loan/loan.service';
import { RepaymentService } from 'src/app/shared/services/repayment/repayment.service';

@Component({
  selector: 'app-loan-summary',
  templateUrl: './loan-summary.component.html',
  styleUrls: ['./loan-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoanSummaryComponent implements OnInit {

  latestLoan$:Observable<any>;
  runningLoan$:Observable<boolean>;
  disbursedLoan$:Observable<any>;
  repayments$:Observable<any[]>;
  
  showRepaymentSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showRepayment$: Observable<boolean> = this.showRepaymentSubject.asObservable();

  constructor(private _router:Router,private _repaymentService:RepaymentService, private _loanService:LoanService, private _requestService:RequestService) { }

  ngOnInit(): void {
    this.latestLoan$ = this._loanService.latestLoan$;
    this.runningLoan$ =this._loanService.runningLoan$;
    this.disbursedLoan$ = this._requestService.loanDetails$;
    this.repayments$ = this._repaymentService.myRepayments$;
    this.latestLoan$.subscribe(l=>{
      if(l&&l.requestStatus=='Funded'){
        this._requestService.selectLoan(l.id);
      }
    })
    
  }
  getDaysLeft(date:any){
    let d = moment(date);
    let now = moment();
    return d.diff(now, "days");
  }
  onNavigate(route:string,params:any={}):void{
    this._router.navigate([route],{queryParams: params})
  }
  getNextDueDateFormatted(dateFunded:any,tenure:number,denominator:string){
  return this._loanService.getNextDueDateFormatted(dateFunded,tenure,denominator);
  }
  // getDaysLeft(dateFunded:any,tenure:number,denominator:string){
  //   return this._loanService.getDaysLeft(dateFunded,tenure,denominator);
  // }
  showRepayment(id: number) {
    this.showRepaymentSubject.next(true);
    this._repaymentService.selectLoan(id);
  }
  closeRepayment() {
    this.showRepaymentSubject.next(false);
  }
  getStatusColor(status: string) {
    if (status == "Paid In Full" || status == "FullPayment") return 'success';
    return status == "Defaulted" ? 'danger' : status == 'Partial' ? 'info' : '';
  }
  trackByFn(index: number, item: any) {
    return index;
  }
}
