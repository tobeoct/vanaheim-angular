import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { businessRoutes, personalRoutes } from '../../helpers/routes';
import { Store } from '../../helpers/store';
import { Utility } from '../../helpers/utility.service';
import { LoanService } from '../../services/loan/loan.service';

@Injectable({
  providedIn: 'root'
})
export class FlowGuard implements CanActivate {
  base = '';
  constructor(
    private _loanService: LoanService,
    private _utility: Utility,
    private _store:Store,
    private _router:Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

      
    console.log("Running Loan ",this._loanService.runningLoanSubject.value)
    if (this._loanService.runningLoanSubject.value==true && !this._router.url.includes("apply") ) {
      this._store.removeItem("page")
      this._store.removeItem("previous")
      this._utility.showLoanInvalid(true,this._router.url);
      this._loanService.continueApplication(false)
      return false;
    }
    this._utility.showLoanInvalid(false,this._router.url);

    return true;

  }

}
