import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { WebNotificationService } from 'src/app/shared/services/web-notification/webnotification.service';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable, Subject, Subscription, timer } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LoanService } from 'src/app/shared/services/loan/loan.service';
import { Router } from '@angular/router';
import { EarningsStore, LoanStore, Store } from 'src/app/shared/helpers/store';
import { EarningService } from 'src/app/shared/services/earning/earning.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  isEnabled: boolean;
  isGranted: boolean;
  updateAvailable = false;
  pwaAble: boolean = true;
  timer$: Observable<any>;
  isLoggedIn: boolean = false;
  showSubject: Subject<string> = new Subject<string>();
  show$: Observable<string> = this.showSubject.asObservable();

  showSuccess$: Observable<boolean>
  show2$: Observable<boolean>
  apiSuccess$: Observable<string>;
  apiError$: Observable<string>;

  activeLoan$: Observable<boolean>;
  activeEarning$:Observable<boolean>;
  runningLoanSubscription: Subscription

  showInvalid$: Observable<boolean>;
  timerSubscription: Subscription;
  constructor(private swPush: SwPush, private _store: Store,private _loanStore:LoanStore,private _earningsStore:EarningsStore, private _earningService: EarningService, private _router: Router, private _utility: Utility, private _loanService: LoanService, private webNotificationService: WebNotificationService, private _authenticationService: AuthService) {
    try {
      this.showInvalid$ = this._utility.showLoanInvalidSubject.asObservable();
      if (environment.production) {
        this.isEnabled = this.swPush ? this.swPush.isEnabled : false;
        if (Notification) {
          this.isGranted = Notification.permission === 'granted';
        } else {
          this.pwaAble = false;
        }
        this.timer$ = timer(0, 100000);
        this.timerSubscription = this.timer$.subscribe(c => {
          if (this.isGranted) this.submitNotification();
        })
      }
    } catch (err: any) {
      console.log(err);
      this.pwaAble = false;
    }

  }
  close = () => {
    setTimeout(() => { this._earningService.showError(false); this._earningService.showSuccess(false) }, 0);
    // this.apiErrorSubject.next();
    // this.apiSuccessSubject.next();
  }
  ngOnDestroy() {
    if (this.timerSubscription) this.timerSubscription.unsubscribe();
    if (this.runningLoanSubscription) this.runningLoanSubscription.unsubscribe()
  }
  ngOnInit(): void {

    this.show2$ = this._earningService.show2$;
    this.showSuccess$ = this._earningService.show$;
    this.apiError$ = this._earningService.apiError$;
    this.apiSuccess$ = this._earningService.apiSuccess$;
    this.activeLoan$ = this._loanService.activeLoanSubject.asObservable();
    this.activeEarning$ = this._earningService.activeEarningSubject.asObservable();
    const sideNavSub = this._utility.activeNavigation$.subscribe(r => {
      this.showSubject.next(r.toString());
    })
    this.isLoggedIn = this._authenticationService.isLoggedIn();

    if (this._earningsStore.earningsApplication) {
      this._earningService.continueApplication(true);
    }
    
    this.runningLoanSubscription = this._loanService.runningLoan$.subscribe(r => {
      // console.log("Running Loan ", r)
      if (localStorage.getItem("loan-page") && r != true && !this._router.url.includes("apply")) {
        this._loanStore.setLoanType(this._loanStore.loanTypeSubject.value, false);
        this._loanStore.setApplyingAs(this._loanStore.applyingAsSubject.value, false);
        this._loanStore.setLoanProduct(this._loanStore.loanProductSubject.value, false);
        setTimeout(() => this._loanService.continueApplication(true), 3000);
      } else {
        if (localStorage.getItem("loan-page") && r == true) {

          this._utility.showLoanInvalidSubject.next(true);
          this._loanStore.setPage("");
          this._store.removeItem("loan-page")
          this._store.removeItem("loan-application")
        }
        this._loanService.continueApplication(false);
      }

    });

  }

  closeInvalid() {
    this._utility.showLoanInvalid(false);
  }
  ngOnChanges(): void {
    try {
      if (Notification) {
        this.isGranted = Notification.permission === 'granted';
      }
    } catch (err: any) {
      console.log(err);
      this.pwaAble = false;
    }
  }
  submitNotification(): void {
    this.webNotificationService.subscribeToNotification();
  }

  reload() {
    document.location.reload();
  }
  routeToPage() {
    let currentPage = this._store.getItem("loan-page");
    let endpoint = "/loans/apply/" + currentPage;
    let baseUrl = "my"
    if (!this.isLoggedIn) {
      baseUrl = "welcome"
    }
    let url = baseUrl + endpoint;
    this._router.navigate([url]);
    this._loanService.continueApplication(false)
  }

  routeToEarningPage() {
    let currentPage = this._store.getItem("earnings-page");
    let endpoint = "/earnings/apply/" + currentPage;
    let baseUrl = "my"
    if (!this.isLoggedIn) {
      baseUrl = "welcome"
    }
    let url = baseUrl + endpoint;
    this._router.navigate([url]);
    this._earningService.continueApplication(false)
  }
}
