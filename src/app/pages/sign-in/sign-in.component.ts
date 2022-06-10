import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import { environment } from "src/environments/environment";
import { signUpForm } from "../../models/interfaces";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from "amazon-cognito-identity-js";
// import custom validator  class
import { CustomValidators } from "../../providers/custom-validator";
import { Router, ActivatedRoute } from "@angular/router";
import { ProfileService } from "../../services/profile.service";
import { ToastrService } from "ngx-toastr";
import { LoginService } from "src/app/services/login.service";
import { ReCaptchaV3Service } from "ng-recaptcha";

@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.css"],
})
export class SignInComponent implements OnInit {
  @Output() signUpClicked: EventEmitter<any> = new EventEmitter();
  isLoading: boolean = false;
  signInForm = this.formBuilder.group({
    emailAddress: ["", [Validators.required, Validators.email]],
    userPassword: ["", [Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private profileService: ProfileService,
    private toastr: ToastrService,
    private loginService: LoginService,
    private recaptchaV3Service: ReCaptchaV3Service
  ) { }

  ngOnInit(): void { }

  signUpClick() {
    this.signUpClicked.emit("signUp");
  }

  get f() {
    return this.signInForm.controls;
  }

  onSubmit() {
    if (this.signInForm.valid) {
      this.recaptchaV3Service.execute('login')
        .subscribe((token) => this.handleToken(token));
      let formInput = this.signInForm.value;
      this.isLoading = true;
      let authenticationDetails = new AuthenticationDetails({
        Username: formInput.emailAddress,
        Password: formInput.userPassword,
      });
      let poolData = {
        UserPoolId: environment.aws.cognitoUserPoolId, // Your user pool id here
        ClientId: environment.aws.cognitoAppClientId, // Your client id here
      };
      let userPool = new CognitoUserPool(poolData);
      let userData = { Username: formInput.emailAddress, Pool: userPool };
      var cognitoUser = new CognitoUser(userData);
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result: any) => {
          console.log(result, "Success");
          sessionStorage.setItem("userSession", JSON.stringify(result));
          this.profileService.profileInfo().subscribe(
            (resp) => {
              console.log(resp, "Response");
              let userData = JSON.parse(resp.body);
              this.isLoading = false;
              sessionStorage.setItem(
                "displayname",
                userData.profile.displayname
              );
              sessionStorage.setItem("isLoggedIn", JSON.stringify(true));
              this.loginService.setIsUserLoggedIn(true)
              this.router.navigate(["/home"]);
            },
            (error) => {
              this.isLoading = false;
              this.loginService.setIsUserLoggedIn(false)
              this.toastr.error(
                "There is something went wrong, when retriving user Information",
                "Error"
              );
            }
          );
        },
        onFailure: (err: any) => {
          this.isLoading = false;
          console.log(err, "Success");
          //User not confirmed... Resend OTP and take the user OTP page
          if (err.code === 'UserNotConfirmedException') {
            this.router.navigate(['/validate-user/' + formInput.emailAddress]);
          } else {
            this.toastr.error(err.message || JSON.stringify(err), "Error");
          }
        },
      });
    } else {
      //alert('Form Error');
      this.toastr.error("Please fill the username and password", "Error");
    }
  }

  handleToken(token: any): void {
    console.debug(`Token [${token}] generated`);
  }
}
