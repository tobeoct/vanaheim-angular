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
    private _store:Store
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (this._loanService.runningLoanSubject.value) {
      this._store.removeItem("page")
      this._store.removeItem("previous")
      this._utility.toggleLoanInvalid();
      return false;
    }

    return true;

  }

}