import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class NoAuthService implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        // logged in so return true
        return true;
    } else  {
    // not logged in so redirect to login page with the return url and return false


      this.router.navigate(['/con/dashboard']);
      return false;

    }
}

}
