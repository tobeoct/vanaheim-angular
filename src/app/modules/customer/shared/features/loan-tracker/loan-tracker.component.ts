import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import moment = require('moment');
import { Observable, Subscription } from 'rxjs';
import { RequestService } from 'src/app/modules/admin/request/request.service';
import { LoanService } from 'src/app/shared/services/loan/loan.service';

@Component({
  selector: 'app-loan-tracker',
  templateUrl: './loan-tracker.component.html',
  styleUrls: ['./loan-tracker.component.scss']
})
export class LoanTrackerComponent implements OnInit {

  @Input()
  details: any;

  @Output()
  showRepayment:EventEmitter<number> = new EventEmitter<number>()
  latestLoanSubscription:Subscription;
  constructor(private _router: Router, private _loanService: LoanService, private _requestService: RequestService) { }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {

  }
  getDaysLeft(date: any) {
    let d = moment(date);
    let now = moment();
    return d.diff(now, "days");
  }
  onNavigate(route: string, params: any = {}): void {
    this._router.navigate([route], { queryParams: params })
  }
  getNextDueDateFormatted(dateFunded: any, tenure: number, denominator: string) {
    return this._loanService.getNextDueDateFormatted(dateFunded, tenure, denominator);
  }
 
  getStatusColor(status: string) {
    if (status == "Paid In Full" || status == "FullPayment") return 'success';
    return status == "Defaulted" ? 'danger' : status == 'Partial' ? 'info' : '';
  }
  trackByFn(index: number) {
    return index;
  }
  
  showRepaymentClicked(id: number) {
    this.showRepayment.emit(id);
  }
}
