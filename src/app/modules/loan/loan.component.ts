import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SideNavigationList } from 'src/app/shared/constants/enum';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LoanService } from 'src/app/shared/services/loan/loan.service';
@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LoanComponent implements OnInit {

showSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
show$:Observable<boolean> = this.showSubject.asObservable();
isLoggedIn:boolean=false;
  constructor( private _authService:AuthService, private _router:Router, private _utility:Utility,private _loanService:LoanService) {
    
   }

   toggleNav(url:string){

    if(url.includes("apply")) this._loanService.continueApplication(false)
    if(url.includes("loan-type")||url.includes("applying-as")||url.includes("loan-product")){
      this.showSubject.next(false);
    }else{
      this.showSubject.next(true);
    }
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
