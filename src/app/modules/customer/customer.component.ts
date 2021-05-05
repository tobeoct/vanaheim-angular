import { Component, OnInit } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { WebNotificationService } from 'src/shared/services/web-notification/webnotification.service';
import { UpdatesService } from 'src/shared/services/web-notification/update.service';
import { Utility } from 'src/shared/helpers/utility.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  isEnabled:boolean = this.swPush.isEnabled;
  isGranted:boolean = Notification.permission === 'granted';
  updateAvailable = false;
  constructor(private swPush: SwPush, private _utility:Utility,private webNotificationService:WebNotificationService, private swUpdate: SwUpdate,private checkForUpdateService: UpdatesService) {

    
    this.swPush.notificationClicks.subscribe( event => {
      console.log('Received notification: ', event);
      const url = event.notification.data.url;
      this._utility.$browser.window.open(url, '_blank');
    });
    this.swUpdate.available.subscribe((event) => {
      this.updateAvailable = true;
    });
    if(this.isGranted) this.submitNotification();
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
  
}
