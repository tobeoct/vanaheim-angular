import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PreventAdminGuard implements CanActivate {
  constructor(
    private router: Router
) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
   if(state.url.includes("admin")){
this.router.navigate(['admin/auth/login'] );
return false;
   }
   return true;

  }
  
}
