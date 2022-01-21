import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Store } from '../../helpers/store';

@Injectable({
  providedIn: 'root'
})
export class PathGuard implements CanActivate {
  base = '';
  constructor(
    private _router: Router,
    private _store: Store,
    private _route: ActivatedRoute
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // if ((loanCategory == "personal" && businessRoutes.some(r => r.path == route.routeConfig?.path)) || (loanCategory == "business" && personalRoutes.some(r => r.path == route.routeConfig?.path))) {
    //   this._router.navigate([route.routeConfig?.path], { relativeTo: this._route.parent });
    //   return false;
    // }

    return true;

  }

}
