import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { SignUpService } from "../../services/sign-up.service";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from "amazon-cognito-identity-js";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-validate-user",
  templateUrl: "./validate-user.component.html",
  styleUrls: ["./validate-user.component.css"],
})
export class ValidateUserComponent implements OnInit {
  currentUserEmail: any;
  otp: any;
  loading: any = {
    resend: false,
    otp: false,
  };

  constructor(
    private _Activatedroute: ActivatedRoute,
    private toastr: ToastrService,
    private signUpService: SignUpService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._Activatedroute.paramMap.subscribe((params) => {
      this.currentUserEmail = params.get("email");
    });
  }

  resendCode() {
    let poolData = {
      UserPoolId: environment.aws.cognitoUserPoolId, // Your user pool id here
      ClientId: environment.aws.cognitoAppClientId, // Your client id here
    };
    let userPool = new CognitoUserPool(poolData);
    let userData = { Username: this.currentUserEmail, Pool: userPool };
    var cognitoUser = new CognitoUser(userData);
    this.loading.resend = true;
    cognitoUser.resendConfirmationCode((err, result) => {
      this.loading.resend = false;
      if (err) {
        this.toastr.error(err?.message, "Error");
      } else {
        this.toastr.success("OTP Send to your email address", "Success");
      }
    });
  }

  validateOtp() {
    if (this.otp != "" && this.currentUserEmail != "") {
      let poolData = {
        UserPoolId: environment.aws.cognitoUserPoolId, // Your user pool id here
        ClientId: environment.aws.cognitoAppClientId, // Your client id here
      };
      let userPool = new CognitoUserPool(poolData);
      let userData = { Username: this.currentUserEmail, Pool: userPool };
      var cognitoUser = new CognitoUser(userData);
      this.loading.otp = true;
      cognitoUser.confirmRegistration(this.otp, true, (err, result) => {
        this.loading.otp = false;
        if (err) {
          this.toastr.error(err.message, err.__type);
        } else {
          this.toastr.success("OTP verified, Please signIn", "Success");
          this.router.navigate(["/sign-in"]);
        }
      });
    } else {
      this.toastr.error("Email or OTP is missing, please try again", "Error");
    }
  }

  resetLoader() {
    this.loading.otp = false;
    this.loading.resend = false;
  }
}
