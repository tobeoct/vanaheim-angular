import { Component, OnInit } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { WebNotificationService } from 'src/app/shared/services/web-notification/webnotification.service';
import { UpdatesService } from 'src/app/shared/services/web-notification/update.service';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { environment } from '@environments/environment';
import { Observable, Subject, timer } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  isEnabled:boolean;
  isGranted:boolean ;
  updateAvailable = false;
  timer$:Observable<any>;
  isLoggedIn:boolean =false;
  showSubject:Subject<string> = new Subject<string>();
  show$:Observable<string> =this.showSubject.asObservable();
  constructor(private swPush: SwPush, private _utility:Utility,private webNotificationService:WebNotificationService, private _authenticationService:AuthService) {

    if(environment.production){
      this.isEnabled = this.swPush?this.swPush.isEnabled:false;
this.isGranted = Notification.permission === 'granted';
    // this.swPush.notificationClicks.subscribe( event => {
    //   console.log('Received notification: ', event);
    //   const url = event.notification.data.url;
    //   this._utility.$browser.window.open(url, '_blank');
    // });
    // this.swUpdate.available.subscribe((event) => {
    //   this.updateAvailable = true;
    // });
    
  this.timer$= timer(0,100000);
  this.timer$.subscribe(c=>{
    if(this.isGranted) this.submitNotification();
  })
  }

  }

  ngOnInit(): void {
    const sideNavSub = this._utility.activeNavigation$.subscribe(r=>{
      this.showSubject.next(r.toString());
  })
    this.isLoggedIn = this._authenticationService.isLoggedIn();
  }
  ngOnChanges(): void {
    this.isGranted = Notification.permission === 'granted';
  }
  submitNotification(): void {
    this.webNotificationService.subscribeToNotification();
  }
  
  reload() {
    document.location.reload();
  }
}
