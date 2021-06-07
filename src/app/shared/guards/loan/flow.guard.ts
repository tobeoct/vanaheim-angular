import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { businessRoutes, personalRoutes } from '../../helpers/routes';
import { Store } from '../../helpers/store';
import { LoanService } from '../../services/loan/loan.service';

@Injectable({
  providedIn: 'root'
})
export class FlowGuard implements CanActivate {
  base='';
  constructor(
    private _loanService:LoanService
) {
 }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
  if(this._loanService.runningLoanSubject.value) 
  {
    return false;
  }
   
return true;

  }
  
}
