import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { NotifyService } from './notify.service';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss']
})
export class NotifyComponent implements OnInit, OnDestroy {
allSubscriptions:Subscription[] =[];
  constructor(private _notifyService: NotifyService, private _authenticationService: AuthService) {

   }
  ngOnDestroy(): void {
    this.allSubscriptions.forEach(sub=>sub.unsubscribe());
  }

  ngOnInit(): void {
    
     const sub = this._notifyService.fetchUsers().pipe(take(1)).subscribe();
     this.allSubscriptions.push(sub);
  }
  

}
