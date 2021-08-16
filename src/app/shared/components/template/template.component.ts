import { TemplateRef, OnInit, Injectable, Component, ViewChild } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { AssetPath } from "src/app/shared/constants/variables";
import { IAssetPath } from "src/app/shared/interfaces/assetpath";
import { LoanService } from "../../services/loan/loan.service";

// @Directive({
//   selector: '[appTemplatePortal]'
// })
// export class TemplatePortalDirective implements AfterViewInit {
//   @Input() outlet: string;

//   constructor(private portalService: TemplatePortalService, private templateRef: TemplateRef<any>) {}

//   ngAfterViewInit(): void {
//     const outlet: TemplatePortalOutletDirective = this.portalService.outlets[this.outlet];
//     outlet.viewContainerRef.clear();
//     outlet.viewContainerRef.createEmbeddedView(this.templateRef);
//   }
// }

// @Directive({
//   selector: '[appTemplatePortalOutlet]'
// })
// export class TemplatePortalOutletDirective implements OnInit {
//   @Input() appTemplatePortalOutlet: string;

//   constructor(private portalService: TemplatePortalService, public viewContainerRef: ViewContainerRef) {}

//   ngOnInit(): void {
//     this.portalService.registerOutlet(this);
//   }
// }

@Injectable({
  providedIn: 'root'
})
export class TemplatePortalService {
  // outlets:any = new Map<string, TemplatePortalOutletDirective>();
  templates:any;
// constructor(private viewContainerRef: ViewContainerRef) {
//   const _injector = this.viewContainerRef.parentInjector;
//   const _parent: AppComponent = _injector.get<AppComponent>(AppComponent); 
//   this.templates = _parent.templates;
// }
  // registerOutlet(outlet: TemplatePortalOutletDirective){
 
  //   this.outlets[outlet.appTemplatePortalOutlet] = outlet;
  // }
}



@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {

  assetPaths: IAssetPath = new AssetPath;
  base:string;
  runningLoan$:Observable<boolean>;
  latestLoan$:Observable<boolean>;
  path:string="/my/loans";
  @ViewChild('loanCard', { read: TemplateRef }) LoanCard:TemplateRef<any>;
  @ViewChild('investmentCard', { read: TemplateRef }) InvestmentCard:TemplateRef<any>;
  constructor(private _router:Router,private _loanService:LoanService) {
  
   }

  ngOnInit(): void {
   this.runningLoan$= this._loanService.runningLoan$;
   this.latestLoan$ = this._loanService.latestLoan$.pipe(map(c=>{
    this.path = c?'/my/loans':'/my/loans/apply'
     return c;
   }));
  
  }
 
onNavigate():void{
  this._router.navigate([this.path])
}

}
