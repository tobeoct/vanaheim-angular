import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoanService } from 'src/app/shared/services/loan/loan.service';

@Component({
  selector: 'app-loan-summary',
  templateUrl: './loan-summary.component.html',
  styleUrls: ['./loan-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoanSummaryComponent implements OnInit {

  latestLoan$:Observable<any>;
  constructor(private _router:Router, private _loanService:LoanService) { }

  ngOnInit(): void {
    this.latestLoan$ = this._loanService.latestLoan$;
    
  }
  onNavigate(route:string,params:any={}):void{
    this._router.navigate([route],{queryParams: params})
  }
}
