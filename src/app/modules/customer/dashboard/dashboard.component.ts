import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from 'src/app/shared/helpers/store';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { EarningService } from 'src/app/shared/services/earning/earning.service';
import { LoanService } from 'src/app/shared/services/loan/loan.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  templates: any;
  runningLoan$: Observable<boolean>;
  latestLoan$: Observable<any>;
  latestEarnings$: Observable<any>;
  constructor(private _loanService: LoanService,private _earningService:EarningService, private _router: Router, private _store: Store, private _utils: Utility) {

  }
  ngAfterViewInit(): void {
    // this.templates = this._templateService.templates;
    // const _injector = this.viewContainerRef.parentInjector;
    // const _parent: AppComponent = _injector.get<AppComponent>(AppComponent); 
    // this.templates = _parent.templates;
    // console.log(this.templates)
  }
  headers: any[] = ['Loan', 'Earnings'];
  ngOnInit(): void {
    this.runningLoan$ = this._loanService.runningLoan$;
    this.latestLoan$ = this._loanService.latestLoan$;
    this.latestEarnings$= this._earningService.latestEarnings$;
    if (this._loanService.validateLoanApplication() && this._store.getItem("fromSignIn")) {
      this.onNavigate("my/loans/apply/preview");
    }
  }
  onNavigate(route: string, params: any = {}): void {
    this._router.navigate([route], { queryParams: params })
  }
  headerClicked(heading: string) {
    this._utils.toggleDashbooardHeading(heading);
  }
}
