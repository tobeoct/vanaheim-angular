import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { WebNotificationService } from 'src/app/shared/services/web-notification/webnotification.service';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable, Subject, Subscription, timer } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LoanService } from 'src/app/shared/services/loan/loan.service';

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


  showInvalid$: Observable<boolean>;
  timerSubscription: Subscription;
  pollingSubscription:Subscription;
  constructor(private swPush: SwPush, private _utility: Utility, private _loanService: LoanService, private webNotificationService: WebNotificationService, private _authenticationService: AuthService) {
    try {
      this.showInvalid$ = this._utility.showLoanInvalid$;
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
    } catch (err) {
      console.log(err);
      this.pwaAble = false;
    }

  }
  ngOnDestroy() {
    if (this.timerSubscription) this.timerSubscription.unsubscribe();
    if(this.pollingSubscription) this.pollingSubscription.unsubscribe();
  }
  ngOnInit(): void {
    const sideNavSub = this._utility.activeNavigation$.subscribe(r => {
      this.showSubject.next(r.toString());
    })
    this.pollingSubscription= this._loanService.getLatest().subscribe(c=>{
    });
    this.isLoggedIn = this._authenticationService.isLoggedIn();

  }

  closeInvalid() {
    this._utility.toggleLoanInvalid();
  }
  ngOnChanges(): void {
    try {
      if (Notification) {
        this.isGranted = Notification.permission === 'granted';
      }
    } catch (err) {
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
}
