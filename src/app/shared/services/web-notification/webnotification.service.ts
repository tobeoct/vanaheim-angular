import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { take, tap } from 'rxjs/operators';
import { environment } from '@environments/environment';

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
    readonly VAPID_PUBLIC_KEY = environment.vapidPublicKey;
    // private baseUrl = `${environment.apiUrl}/notification/subscribe`;
    subscribeToNotification() {
      // console.log("subscribing")
      
   if(this._swPush){
      this.requestSubscription()
      .then(sub => {
        this.sendToServer(sub)
      })
      .catch((err:any) => console.error('Could not subscribe to notifications', err));
    }
    }
    sendToServer(params: any) {
      this.http.post(`${environment.apiUrl}/notification/subscribe`, { token : params, browserID: this._utility.$browserID }).pipe(take(1)).subscribe();
    }
 private requestSubscription=()=>{
   return this._swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
  })
}
}
