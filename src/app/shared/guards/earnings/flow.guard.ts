import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
@Injectable({
  providedIn: 'root'
})
export class EarningFlowGuard implements CanActivate {
  constructor(private _authService:AuthService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if(!this._authService.isLoggedInSubject.value){
      return false;
    }
    return true;

  }

}
