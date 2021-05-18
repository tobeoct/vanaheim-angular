import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from '@models/subscription';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
const data = {
  business:[],
  personal:[
    {title:"Loan Details", id:"loan-calculator",url:"loan-calculator"},
    {title:"BVN", id:"bvn-info",url:"bvn-info"},
    {title:"Personal", id:"personal-info",url:"personal-info"},
    {title:"Account", id:"account-info",url:"account-info"},
    {title:"Employment", id:"employment-info",url:"employment-info"},
    {title:"Next Of Kin", id:"nok-info",url:"nok-info"},
    {title:"Documents", id:"upload",url:"upload"},
    {title:"Preview", id:"preview",url:"preview"},
    {title:"Home", id:"home",url:""},

]
}
@Component({
  selector: 'app-loan-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

 
  logoutSub:Subscription;
  theme:string;
active$:Observable<string>;
isLoggedIn:boolean=false;
dataSelectionSubject:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
dataSelection$:Observable<any[]> = this.dataSelectionSubject.asObservable();

showSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
show$:Observable<boolean> = this.showSubject.asObservable();
  constructor(private _router: Router, private _utility:Utility, private _route: ActivatedRoute, private _authService:AuthService) {
    this.toggleNav(this._router.url);
    this.active$ = this._utility.activeSolution$;
    this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
      this.toggleNav(x.url);
     });
   }

   toggleNav(url:string){
    if(url.includes("loan-type")||url.includes("applying-as")||url.includes("loan-product")){
      this.showSubject.next(false);
    }else{
      this.showSubject.next(true);
    }
   }
  ngOnInit(): void {
    this.dataSelectionSubject.next(data.personal);
    this.isLoggedIn = this._authService.isLoggedIn();
  }

  onNavigate(route:string){
    this._router.navigate([route], { relativeTo: this._route })
  }

    
  trackByFn(index:any, item:any) {
    return index; // or item.id
  }


}
