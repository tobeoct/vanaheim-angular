import { Directive, AfterViewInit, Input, TemplateRef, OnInit, ViewContainerRef, Injectable, Component, ViewChild } from "@angular/core";
import { AppComponent } from "src/app/app.component";
import { AssetPath } from "src/shared/constants/variables";
import { IAssetPath } from "src/shared/interfaces/assetpath";
import { PageComponent } from "src/shared/layout/page/page.component";

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
  @ViewChild('loanCard', { read: TemplateRef }) LoanCard:TemplateRef<any>;
  @ViewChild('investmentCard', { read: TemplateRef }) InvestmentCard:TemplateRef<any>;
  constructor() { }

  ngOnInit(): void {
  }

}
