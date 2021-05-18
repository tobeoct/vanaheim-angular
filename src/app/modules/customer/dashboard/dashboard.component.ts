import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
templates:any
  constructor() { 
    
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
