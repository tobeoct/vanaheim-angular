import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserCategory } from '@enums/usercategory';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class WelcomeGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthService
) { }

  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.authenticationService.userValue;
    if (!this.authenticationService.isLoggedIn()) {
          return true;
    }

    // not logged in so redirect to login page with the return url
    // this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    if(user.category== UserCategory.Staff){
        this.router.navigate(['/admin']);
        }else{
            this.router.navigate(['/my']);
        }
    return false;
}
  
}
