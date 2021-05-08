import { ChangeDetectionStrategy, Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { UserCategory } from '@enums/usercategory';
import { AuthService } from 'src/shared/services/auth/auth.service';
import { User } from 'src/shared/interfaces/user';
import { Observable, Subject, Subscription } from 'rxjs';
import { Utility } from 'src/shared/helpers/utility.service';
import { SideNavigationList } from 'src/shared/constants/enum';

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
  @ViewChild('templates') templates:any; 
  constructor(private authenticationService: AuthService, private _utility:Utility){
  

  }
  // authSub:Subscription
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
   
  }

  ngOnDestroy(){
    this.allSubscriptions.forEach(sub=>{
    sub.unsubscribe();
    });
  }
  // isLogged(){
   
  // }
}
