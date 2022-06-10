import { Component, OnInit, Injectable , EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-login-header',
  templateUrl: './login-header.component.html',
  styleUrls: ['./login-header.component.css']
})

@Injectable({
  providedIn: 'root'
})
export class LoginHeaderComponent implements OnInit {
  currentName: string = ''; 
  isLoggedIn: any;
  
  constructor(
    private router: Router, 
    private loginService: LoginService,
    private menuService: MenuService
  ) { }

  ngOnInit(): void {
    this.checkLogin();
  }

  checkScroll(): void{

  }
  checkLogin(): void {
    if(sessionStorage.getItem('isLoggedIn') !== null) {
      let value:any = sessionStorage.getItem('isLoggedIn');  
      this.isLoggedIn = JSON.parse(value);
      this.currentName = this.loginService.getUserName();
    } else {
      this.isLoggedIn = false;
    }
  }

  onLogout(): void {
    this.loginService.logout();
    this.checkLogin();
    this.router.navigate(['/']);
  }

  menuClick(menuName: any) {
    this.router.navigate(
      ['/home'],
      { queryParams: { sect: menuName } }
    );
    this.menuService.menuClicked(menuName);
  }
}
