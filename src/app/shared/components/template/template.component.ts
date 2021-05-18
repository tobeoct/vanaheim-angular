import { TemplateRef, OnInit, Injectable, Component, ViewChild } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { AssetPath } from "src/app/shared/constants/variables";
import { IAssetPath } from "src/app/shared/interfaces/assetpath";

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
  @ViewChild('loanCard', { read: TemplateRef }) LoanCard:TemplateRef<any>;
  @ViewChild('investmentCard', { read: TemplateRef }) InvestmentCard:TemplateRef<any>;
  constructor(private _router:Router) {
  
   }

  ngOnInit(): void {
  }
 
onNavigate(route:string,params:any={}):void{
  this._router.navigate([route],{queryParams: params})
}

}
