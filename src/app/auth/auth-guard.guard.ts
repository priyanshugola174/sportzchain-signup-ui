import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router, 
    private authService: AuthService,
    private loginService: LoginService
  ){}

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.loginService.getIsUserLoggedIn().subscribe(isUserLoggedIn => {
      if(!isUserLoggedIn) {
        this.router.navigate(['signin'])
      }
      return isUserLoggedIn;
    })
    return false;
  }
}