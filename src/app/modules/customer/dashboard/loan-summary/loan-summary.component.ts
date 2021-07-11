import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import moment = require('moment');
import { BehaviorSubject, Observable } from 'rxjs';
import { LoanService } from 'src/app/shared/services/loan/loan.service';

@Component({
  selector: 'app-loan-summary',
  templateUrl: './loan-summary.component.html',
  styleUrls: ['./loan-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoanSummaryComponent implements OnInit {

  latestLoan$:Observable<any>;
  runningLoan$:Observable<boolean>;
  constructor(private _router:Router, private _loanService:LoanService) { }

  ngOnInit(): void {
    this.latestLoan$ = this._loanService.latestLoan$;
    this.runningLoan$ =this._loanService.runningLoan$;
    
  }
  onNavigate(route:string,params:any={}):void{
    this._router.navigate([route],{queryParams: params})
  }
  getNextDueDateFormatted(dateFunded:any,tenure:number,denominator:string){
  return this._loanService.getNextDueDateFormatted(dateFunded,tenure,denominator);
  }
  getDaysLeft(dateFunded:any,tenure:number,denominator:string){
    return this._loanService.getDaysLeft(dateFunded,tenure,denominator);
  }
}
