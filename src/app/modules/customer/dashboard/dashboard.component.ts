import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from 'src/app/shared/helpers/store';
import { LoanService } from 'src/app/shared/services/loan/loan.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
templates:any;
runningLoan$:Observable<boolean>;
latestLoan$:Observable<boolean>;
  constructor(private _loanService:LoanService, private _router:Router,private _store:Store) { 

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
    this.runningLoan$ = this._loanService.runningLoan$;
    this.latestLoan$ = this._loanService.latestLoan$;
    if(this._loanService.validateLoanApplication() && this._store.getItem("fromSignIn")){
      this.onNavigate("my/loans/apply/preview");
    }
  }
  onNavigate(route:string,params:any={}):void{
    this._router.navigate([route],{queryParams: params})
  }

}
