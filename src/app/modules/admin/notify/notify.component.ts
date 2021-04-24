import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/shared/services/auth/auth.service';
import { NotifyService } from './notify.service';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss']
})
export class NotifyComponent implements OnInit, OnDestroy {
sub:Subscription
  constructor(private _notifyService: NotifyService, private _authenticationService: AuthService) {

   }
  ngOnDestroy(): void {
    if(this.sub){
  this.sub.unsubscribe();
    }
  }

  ngOnInit(): void {
    // this._authenticationService.fetchToken().pipe(take(1)).subscribe(token=>{
    //   console.log("Token", token.response.response)
      // request = request.clone({
      //     setHeaders: { 
      //         Authorization: `Bearer ${token.response.response}`
      //     }
      // });
      this.sub = this._notifyService.fetchUsers().pipe(take(1)).subscribe();
  // })
    
  }
  

}
