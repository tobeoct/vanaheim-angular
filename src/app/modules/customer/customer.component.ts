import { Component, OnInit } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { WebNotificationService } from 'src/app/shared/services/web-notification/webnotification.service';
import { UpdatesService } from 'src/app/shared/services/web-notification/update.service';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { environment } from '@environments/environment';
import { Observable, timer } from 'rxjs';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  isEnabled:boolean = this.swPush.isEnabled;
  isGranted:boolean = Notification.permission === 'granted';
  updateAvailable = false;
  timer$:Observable<any>;
  constructor(private swPush: SwPush, private _utility:Utility,private webNotificationService:WebNotificationService, private swUpdate: SwUpdate,private checkForUpdateService: UpdatesService) {

    if(environment.production){
    this.swPush.notificationClicks.subscribe( event => {
      console.log('Received notification: ', event);
      const url = event.notification.data.url;
      this._utility.$browser.window.open(url, '_blank');
    });
    this.swUpdate.available.subscribe((event) => {
      this.updateAvailable = true;
    });
  }
  this.timer$= timer(0,100000);
  this.timer$.subscribe(c=>{
    if(this.isGranted) this.submitNotification();
  })
    // this.webNotificationService.requestSubscription().then(sub => {
    //   console.log(sub);});

  }

  ngOnInit(): void {
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
