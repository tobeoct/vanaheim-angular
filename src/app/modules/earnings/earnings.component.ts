import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SideNavigationList } from 'src/app/shared/constants/enum';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.scss']
})
export class EarningsFlowComponent implements OnInit {

  
showSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
show$:Observable<boolean> = this.showSubject.asObservable();
isLoggedIn:boolean=false;
  constructor( private _authService:AuthService, private _router:Router, private _utility:Utility) {
    
   }

   toggleNav(url:string){
      this.showSubject.next(true);
    
   }
  ngOnInit(): void {
    this.isLoggedIn = this._authService.isLoggedIn();
    this.toggleNav(this._router.url);
    this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
      this.toggleNav(x.url);
     });
  }


  toggleSideNav(){
    this._utility.toggleSideNav(SideNavigationList.faq);
  }
 


}
