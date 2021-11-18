import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { WebNotificationService } from 'src/app/shared/services/web-notification/webnotification.service';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable, Subject, Subscription, timer } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LoanService } from 'src/app/shared/services/loan/loan.service';
import { Router } from '@angular/router';
import { Store } from 'src/app/shared/helpers/store';
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
  runningLoanSubscription: Subscription

  showInvalid$: Observable<boolean>;
  timerSubscription: Subscription;
  constructor(private swPush: SwPush, private _store: Store, private _earningService: EarningService, private _router: Router, private _utility: Utility, private _loanService: LoanService, private webNotificationService: WebNotificationService, private _authenticationService: AuthService) {
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
    const sideNavSub = this._utility.activeNavigation$.subscribe(r => {
      this.showSubject.next(r.toString());
    })
    this.isLoggedIn = this._authenticationService.isLoggedIn();

    if (Object.keys(this._store.getEarningApplication()).length > 0) {
      // this._store.saveEarningApplication(this._store.getEarningApplication());
      this._earningService.apply(this._store.getEarningApplication()).pipe(take(1)).subscribe(
        data => {

          setTimeout(() => { this._earningService.success(data.message); this._earningService.showSuccess(true); }, 0);

        },
        (error: string) => {
          if (error == "Not Found") error = "You do not seem to be connected to the internet";
          setTimeout(() => { this._earningService.error(error); this._earningService.showError(true); }, 0);

        });

      this._store.removeEarningApplication()
    }
    this.runningLoanSubscription = this._loanService.runningLoan$.subscribe(r => {
      // console.log("Running Loan ", r)
      if (localStorage.getItem("page") && r != true && !this._router.url.includes("apply")) {
        this._store.setLoanType(this._store.loanTypeSubject.value, false);
        this._store.setApplyingAs(this._store.applyingAsSubject.value, false);
        this._store.setLoanProduct(this._store.loanProductSubject.value, false);
        setTimeout(() => this._loanService.continueApplication(true), 3000);
      } else {
        if (localStorage.getItem("page") && r == true) {

          this._utility.showLoanInvalidSubject.next(true);
          this._store.setPage("");
          this._store.removeItem("page")
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
    let currentPage = this._store.getItem("page");
    let endpoint = "/loans/apply/" + currentPage;
    let baseUrl = "my"
    if (!this.isLoggedIn) {
      baseUrl = "welcome"
    }
    let url = baseUrl + endpoint;
    this._router.navigate([url]);
    this._loanService.continueApplication(false)
  }
}
