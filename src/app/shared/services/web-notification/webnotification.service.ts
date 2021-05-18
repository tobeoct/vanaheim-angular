import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebNotificationService {
 
    constructor(
        private http: HttpClient,
        private _swPush: SwPush,
        private _utility:Utility
    ) {
        
    }
    readonly VAPID_PUBLIC_KEY = 'BH9z7PCyti1n9ItSnlp_8qoyDHP-RUK-vdZrTCqaoYHKVKIlk2w3XPoZLSndWp23VPVepP7gZ6diOFTbQNLpeBc';
    private baseUrl = 'http://localhost:4200/api/notification/subscribe';
    subscribeToNotification() {
      console.log("subscribing")
      this.requestSubscription()
      .then(sub => {
        console.log(sub);
        this.sendToServer(sub)
      })
      .catch(err => console.error('Could not subscribe to notifications', err));
    }
    sendToServer(params: any) {
      this.http.post(this.baseUrl, { token : params, browserID: this._utility.$browserID }).pipe(tap(console.log),take(1)).subscribe();
    }
 private requestSubscription=()=>{
   return this._swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
  })
}
}
