import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Store } from 'src/app/shared/helpers/store';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
const data:any = {
  business:[{title:"Loan Details", id:"loan-calculator",url:"loan-calculator"},
  {title:"Additional", id:"additional-info",url:"additional-info"},
  {title:"Company", id:"company-info",url:"company-info"},
  {title:"Shareholder", id:"shareholder-info",url:"shareholder-info"},
  {title:"Collateral", id:"collateral-info",url:"collateral-info"},
  {title:"Account", id:"account-info",url:"account-info"},
  {title:"Documents", id:"upload",url:"upload"},
  {title:"Preview", id:"preview",url:"preview"},
  {title:"Login", id:"login",url:"/auth/account"}],
  personal:[
    {title:"Loan Details", id:"loan-calculator",url:"loan-calculator"},
    {title:"BVN", id:"bvn-info",url:"bvn-info"},
    {title:"Personal", id:"personal-info",url:"personal-info"},
    {title:"Account", id:"account-info",url:"account-info"},
    {title:"Employment", id:"employment-info",url:"employment-info"},
    {title:"Next Of Kin", id:"nok-info",url:"nok-info"},
    {title:"Documents", id:"upload",url:"upload"},
    {title:"Preview", id:"preview",url:"preview"},
    {title:"Login", id:"login",url:"/auth/account"},

]
}
@Component({
  selector: 'app-loan-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent implements OnInit,OnDestroy {

 
  logoutSub:Subscription;
  theme:string;
  allSubscriptions:Subscription[]=[];
active$:Observable<string>;
isLoggedIn:boolean=false;
dataSelectionSubject:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
dataSelection$:Observable<any[]> = this.dataSelectionSubject.asObservable();
showSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
show$:Observable<boolean> = this.showSubject.asObservable();
  constructor(private _router: Router, private _utility:Utility,private _store:Store, private _route: ActivatedRoute, private _authService:AuthService) {
    this.toggleNav(this._router.url);
    this.active$ = this._utility.activeSolution$;
    this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((x: any) => {
      this.toggleNav(x.url);
     });
   }
  ngOnDestroy(): void {
    this.allSubscriptions.forEach(sub=>sub.unsubscribe());
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
    let sub = this._store.loanCategory$.subscribe((c:string)=>{
      console.log(c)
      let links = data[c].filter((d:any)=>{
        if(c=="personal") return true;
         if(this.isLoggedIn && c=="business" && d.title!="Additional") return false;
         return true; 
      })
      this.dataSelectionSubject.next(links)
    });
    this.allSubscriptions.push(sub);
  }

  onNavigate(route:string){
    this._router.navigate([route], { relativeTo: this._route })
  }

    
  trackByFn(index:any, item:any) {
    return index; // or item.id
  }


}
