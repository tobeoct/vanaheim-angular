import { AfterViewInit, Component, OnInit, ViewContainerRef } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { TemplatePortalService } from 'src/shared/components/template/template.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
templates:any
  constructor(private _templateService:TemplatePortalService,private viewContainerRef: ViewContainerRef) { 
    
  }
  ngAfterViewInit(): void {
    // this.templates = this._templateService.templates;
    // const _injector = this.viewContainerRef.parentInjector;
    // const _parent: AppComponent = _injector.get<AppComponent>(AppComponent); 
    // this.templates = _parent.templates;
    // console.log(this.templates)
  }

headers:any[]= ['Loan','Investment'];
  ngOnInit(): void {
  }

}
