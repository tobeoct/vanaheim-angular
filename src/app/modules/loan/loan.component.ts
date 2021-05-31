import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
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
  constructor( private _authService:AuthService, private _router:Router) {
    
   }

   toggleNav(url:string){
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

 

}
