import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoginService } from "../../services/login.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  isSignUp: boolean = true;
  currentName: string = "";
  isLoggedIn: any;
  constructor(
    private loginService: LoginService,
    private router: Router) {}

  ngOnInit(): void {
    this.checkLogin();
  }

  checkLogin(): void {
    if(this.loginService.getIsUserLoggedIn()){
      this.currentName = this.loginService.getUserName();
      this.router.navigate(['/home']);
    }else{
      this.loginService.logout();
      this.router.navigate(['/']);
    }
  }

  signInClickHandler(output: any) {
    this.isSignUp = false;
  }

  signUpClickHandler(output: any) {
    this.isSignUp = true;
  }
}
