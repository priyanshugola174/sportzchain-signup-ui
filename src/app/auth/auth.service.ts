import { Injectable } from '@angular/core';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private loginService: LoginService
  ) { }

  isLoggedIn(): boolean {
    var isAuth = false;
    let poolData = {
      UserPoolId: environment.aws.cognitoUserPoolId,
      ClientId: environment.aws.cognitoAppClientId
    };
    var userPool = new CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.getSession((err: any, session: any) => {
        if (err) {
          alert(err.message || JSON.stringify(err));
        }
        isAuth = session.isValid();
      })
    }
    this.loginService.setIsUserLoggedIn(isAuth)
    return isAuth;
  }

  userValue(): any {
    let userSession = JSON.parse(sessionStorage.getItem("userSession") || "{}");
    if(userSession && userSession.accessToken){
      return userSession.accessToken.jwtToken;
    }else{
      return "";
    }
  }

  logout() {
    sessionStorage.removeItem('userSession');
    sessionStorage.removeItem('displayname'); 
    sessionStorage.removeItem('isLoggedIn'); 
    this.loginService.setIsUserLoggedIn(false);
    this.router.navigate(['/']);
  }
}