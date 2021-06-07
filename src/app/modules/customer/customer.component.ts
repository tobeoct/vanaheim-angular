import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { WebNotificationService } from 'src/app/shared/services/web-notification/webnotification.service';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
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
  pwaAble:boolean = true;
  timer$:Observable<any>;
  isLoggedIn:boolean =false;
  showSubject:Subject<string> = new Subject<string>();
  show$:Observable<string> =this.showSubject.asObservable();

  
  showInvalid$:Observable<boolean>;
  
  constructor(private swPush: SwPush, private _utility:Utility,private webNotificationService:WebNotificationService, private _authenticationService:AuthService) {
try{
  this.showInvalid$ = this._utility.showLoanInvalid$;
    if(environment.production){
      this.isEnabled = this.swPush?this.swPush.isEnabled:false;
      if(Notification){
this.isGranted = Notification.permission === 'granted';
      }else{
        this.pwaAble = false;
      }
  this.timer$= timer(0,100000);
  this.timer$.subscribe(c=>{
    if(this.isGranted) this.submitNotification();
  })
  }
}catch(err){
  console.log(err);
  this.pwaAble = false;
}

  }

  ngOnInit(): void {
    const sideNavSub = this._utility.activeNavigation$.subscribe(r=>{
      this.showSubject.next(r.toString());
  })
    this.isLoggedIn = this._authenticationService.isLoggedIn();
  }

  closeInvalid(){
    this._utility.toggleLoanInvalid();
  }
  ngOnChanges(): void {
    try{
    if(Notification){
    this.isGranted = Notification.permission === 'granted';
    }
  }catch(err){
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
