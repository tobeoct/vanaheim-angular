import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnChanges, OnInit, ViewChild } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { UserCategory } from '@enums/usercategory';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { User } from 'src/app/shared/interfaces/user';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { environment } from '@environments/environment';
import { UpdatesService } from './shared/services/web-notification/update.service';
import { WebNotificationService } from './shared/services/web-notification/webnotification.service';
import moment = require('moment');
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnChanges, OnInit {
  title = 'vanaheim';
  isLoggedIn: Boolean = false;
  navType: UserCategory = UserCategory.Customer;
  isEnabled: boolean;
  isGranted: boolean;
  updateAvailable = false;
  showLogoutSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showLogout$: Observable<boolean> = this.showLogoutSubject.asObservable();
  @ViewChild('templates') templates: any;

  timeoutWarningId: any;
  timeoutId: any;
  userInactive: Subject<any> = new Subject();

  apiSuccess$: Observable<string> 
  apiError$: Observable<string>
  apiInfo$: Observable<string>



  checkTimeOut() {
    if(this.timeoutWarningId || this.timeoutId) return;
    let buffer = 120000;
    let timeout = this.authenticationService.getExpiration()?.subtract(2, "minutes").diff(moment(), "milliseconds");
    this.timeoutWarningId = setTimeout(

      () => {
        this.showLogoutSubject.next(true);
        this.timeoutId = setTimeout(() => this.logout(), buffer)
      }, timeout);


  }
  logout() {
    this.authenticationService.logout();
    clearTimeout(this.timeoutId);
    clearTimeout(this.timeoutWarningId);
    this.showLogoutSubject.next(false);
  }
  stay() {
    this.authenticationService.stay().subscribe(c => {

      this.showLogoutSubject.next(false);
      clearTimeout(this.timeoutWarningId);
      clearTimeout(this.timeoutId);
      this.timeoutWarningId = undefined;
      this.timeoutId = undefined;
      if (this.isLoggedIn) {
        this.checkTimeOut();
      }
    }, (error: any) => {

    })
  }
  @HostListener('window:keydown')
  @HostListener('window:mousedown')
  checkUserActivity() {

    if (this.isLoggedIn) {
      this.stay();
    }
  }
  constructor(private authenticationService: AuthService,private _router:Router, private _utility: Utility, private swPush: SwPush, private webNotificationService: WebNotificationService, private swUpdate: SwUpdate, private _authenticationService: AuthService) {
    try {
      this.authenticationService.isLoggedIn$.subscribe(c => {
        if (c == true) {
          this.checkTimeOut();
        }
      })
      // this.userInactive.subscribe((message) => {

      //   alert(message);
      // }
      // );
      if (environment.production) {
        this.isEnabled = this.swPush ? this.swPush.isEnabled : false;
        if (Notification) {
          this.isGranted = Notification.permission === 'granted';
        }
        this.swPush.notificationClicks.subscribe((event: any) => {
          // console.log('Received notification: ', event);
          const url = event.notification.data.url;
          this._utility.$browser.window.open(url, '_blank');
        });
        this.swUpdate.available.subscribe((event) => {
          this.updateAvailable = true;
        });
      }
    } catch (err:any) {
      console.log(err);
    }

  }
  allSubscriptions: Subscription[] = [];
  showSubject: Subject<string> = new Subject<string>();
  show$: Observable<string> = this.showSubject.asObservable();
  ngOnInit(): void {
    const sideNavSub = this._utility.activeNavigation$.subscribe(r => {
      this.showSubject.next(r.toString());
    })
    this.allSubscriptions.push(sideNavSub);
    const authSub = this.authenticationService.user.pipe(debounceTime(100)).subscribe((user: User) => {
      this.navType = user.category as UserCategory;
      if (this.authenticationService.isLoggedIn()) {
        this.isLoggedIn = true;
      }
      else {
        this.isLoggedIn = false;
      }
    })
    this.allSubscriptions.push(authSub)
    this.apiError$ = this._utility.apiErrorSubject.asObservable();
    this.apiSuccess$ = this._utility.apiSuccessSubject.asObservable();
    this.apiInfo$ = this._utility.apiInfoSubject.asObservable();
  }
  ngOnChanges(): void {
    try {
      if (Notification) {
        this.isGranted = Notification.permission === 'granted';
      }
    } catch (err:any) {
      console.log(err);
    }

  }

  ngOnDestroy() {
    this.allSubscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

}
