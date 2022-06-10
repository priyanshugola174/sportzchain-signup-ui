import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  private isUserLoggedIn = new Subject<boolean>();

  constructor(private http: HttpClient) {
    this.isUserLoggedIn.next(false);
  }

  setIsUserLoggedIn(isUserLoggedIn: boolean) {
    this.isUserLoggedIn.next(isUserLoggedIn);
  }

  getIsUserLoggedIn(): Observable<boolean> {
    if(sessionStorage.getItem('isLoggedIn') !== null) {
      let value:any = sessionStorage.getItem('isLoggedIn'); 
      this.setIsUserLoggedIn(JSON.parse(value));
    } else {
      this.setIsUserLoggedIn(false);
    }
    return this.isUserLoggedIn.asObservable();
  }

  public getUserName(): any {
    return sessionStorage.getItem('displayname');
  }

  logout() {
      sessionStorage.removeItem('userSession');
      sessionStorage.removeItem('displayname'); 
      sessionStorage.removeItem('isLoggedIn');
      this.setIsUserLoggedIn(false)
  }
}