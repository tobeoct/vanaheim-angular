import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { UserCategory } from '@enums/usercategory';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { User } from 'src/app/shared/interfaces/user';
import { Observable, Subject, Subscription } from 'rxjs';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { environment } from '@environments/environment';
import { UpdatesService } from './shared/services/web-notification/update.service';
import { WebNotificationService } from './shared/services/web-notification/webnotification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnChanges, OnInit {
  title = 'vanaheim';
  isLoggedIn:Boolean = false;
  navType:UserCategory = UserCategory.Customer;
  isEnabled:boolean ;
  isGranted:boolean;
  updateAvailable = false;
  @ViewChild('templates') templates:any; 
  constructor(private authenticationService: AuthService, private _utility:Utility,private swPush: SwPush,private webNotificationService:WebNotificationService, private swUpdate: SwUpdate,private _authenticationService:AuthService){
  try{
    if(environment.production){
      this.isEnabled = this.swPush?this.swPush.isEnabled:false;
this.isGranted = Notification.permission === 'granted';
      this.swPush.notificationClicks.subscribe( (event:any) => {
        // console.log('Received notification: ', event);
        const url = event.notification.data.url;
        this._utility.$browser.window.open(url, '_blank');
      });
      this.swUpdate.available.subscribe((event) => {
        this.updateAvailable = true;
      });
    }
  }catch(err){
    alert(err);
  }

  }
  allSubscriptions:Subscription[]=[];
  showSubject:Subject<string> = new Subject<string>();
  show$:Observable<string> =this.showSubject.asObservable();
  ngOnInit(): void {
    const sideNavSub = this._utility.activeNavigation$.subscribe(r=>{
      this.showSubject.next(r.toString());
  })
  this.allSubscriptions.push(sideNavSub);
    const authSub = this.authenticationService.user.pipe(debounceTime(100)).subscribe((user:User)=>{
      this.navType = user.category as UserCategory;
      if (this.authenticationService.isLoggedIn()) { 
        this.isLoggedIn = true;
      }
      else{
        this.isLoggedIn = false;
      }
    })
    this.allSubscriptions.push(authSub)
  }
  ngOnChanges(): void {
   try{
    this.isGranted = Notification.permission === 'granted';
   }catch(err){
     alert(err);
   }
  
  }

  ngOnDestroy(){
    this.allSubscriptions.forEach(sub=>{
    sub.unsubscribe();
    });
  }

}
