import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {AuthService} from './auth.service';
// import {JwtHelper} from 'angular2-jwt';

@Injectable()

export class AuthGuard implements CanActivate {
//  jwtHelper: JwtHelper = new JwtHelper();

  constructor(private router: Router,
              private authService: AuthService) {
  }



    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      if (localStorage.getItem('token')) {
        return true;
      }
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      return false;
    }


}
