import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, CanActivateChild } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild{

  constructor(
    private loginService: LoginService, 
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(sessionStorage.getItem('isLoggedIn') !== null) {
      let value:any = sessionStorage.getItem('isLoggedIn');  
      const isLoggedIn = JSON.parse(value);
      return isLoggedIn;
    } else {
      return false;
    }
  }  

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    return this.canActivate(route, state);
  }
}
