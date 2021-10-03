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

  activeLoan$: Observable<boolean>;
  runningLoanSubscription: Subscription

  showInvalid$: Observable<boolean>;
  timerSubscription: Subscription;
  constructor(private swPush: SwPush, private _store: Store, private _router: Router, private _utility: Utility, private _loanService: LoanService, private webNotificationService: WebNotificationService, private _authenticationService: AuthService) {
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
  ngOnDestroy() {
    if (this.timerSubscription) this.timerSubscription.unsubscribe();
    if (this.runningLoanSubscription) this.runningLoanSubscription.unsubscribe()
  }
  ngOnInit(): void {

    this.activeLoan$ = this._loanService.activeLoanSubject.asObservable();
    const sideNavSub = this._utility.activeNavigation$.subscribe(r => {
      this.showSubject.next(r.toString());
    })
    this.isLoggedIn = this._authenticationService.isLoggedIn();

    this.runningLoanSubscription = this._loanService.runningLoan$.subscribe(r => {
      if (localStorage.getItem("page") && !r) {

        this._loanService.continueApplication(true);
      } else {
        this._utility.showLoanInvalidSubject.next(true);
        this._loanService.continueApplication(false);
      }

    });

  }

  closeInvalid() {
    this._utility.toggleLoanInvalid();
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
