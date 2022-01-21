import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import moment = require('moment');
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { AdminEarningService } from 'src/app/shared/services/earning/admin-earning.service';
import { EarningPayoutService } from 'src/app/shared/services/earning/earning-payout.service';
import { EarningService } from 'src/app/shared/services/earning/earning.service';

@Component({
  selector: 'app-investment-summary',
  templateUrl: './investment-summary.component.html',
  styleUrls: ['./investment-summary.component.scss']
})
export class InvestmentSummaryComponent implements OnInit {

  latestEarnings$: Observable<any[]>;
  runningEarning$: Observable<boolean>;
  approvedEarnings$: Observable<any>;
  earningPayouts$: Observable<any[]>;

  showPayoutSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showPayout$: Observable<boolean> = this.showPayoutSubject.asObservable();
  latestEarningSubscription: Subscription;
  constructor(private _router: Router, private _earningPayoutService: EarningPayoutService, private _earningService: EarningService, private _requestService: AdminEarningService) { }
  ngOnDestroy(): void {
    if (this.latestEarningSubscription) this.latestEarningSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.latestEarnings$ = this._earningService.latestEarnings$;
    this.runningEarning$ = this._earningService.runningEarning$;
    this.approvedEarnings$ = this._requestService.allEarningDetails$;
    this.earningPayouts$ = this._earningPayoutService.myEarningPayouts$;
    this.latestEarningSubscription = this.latestEarnings$.subscribe(l => {
      // if (l && l.requestStatus == 'FundsReceived') {
      //   this._requestService.selectEarning(l.id);
      // }
    })

  }
  getDaysLeft(date: any) {
    let d = moment(date);
    let now = moment();
    return d.diff(now, "days");
  }


  getTimeLeft(date: any) {
    let d = moment(date);
    let now = moment();
    return d.diff(now, "months");
  }
  onNavigate(route: string, params: any = {}): void {
    this._router.navigate([route], { queryParams: params })
  }
  getNextDueDateFormatted(dateFunded: any, tenure: number, denominator: string) {
    return this._earningService.getNextDueDateFormatted(dateFunded, tenure, denominator);
  }
  // getDaysLeft(dateFunded:any,tenure:number,denominator:string){
  //   return this._earningService.getDaysLeft(dateFunded,tenure,denominator);
  // }
  showPayout(id: number) {
    this.showPayoutSubject.next(true);
    this._earningPayoutService.selectEarning(id);
  }
  closePayout() {
    this.showPayoutSubject.next(false);
  }
  getStatusColor(status: string) {
    if (status == "Paid In Full" || status == "FullPayment") return 'success';
    return status == "Defaulted" ? 'danger' : status == 'Partial' ? 'info' : '';
  }
  trackByFn(index: number, item: any) {
    return index;
  }
}
