import { Component, OnInit } from '@angular/core';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  
  firstStep: boolean = true;
  emailAddress: any;
  isLoading: boolean = false;
  resetForm = this.formBuilder.group({
    otp: ['', [Validators.required]],
    intialPassword: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]]
  });

  constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {   
  }

  alreadyOtpExists() {
    this.firstStep = false;
  }

  goBack() {
    this.firstStep = true;
  }

  onSubmit() {
    if (this.resetForm.valid) {
      let formData = this.resetForm.value;
      let poolData = {
        UserPoolId: environment.aws.cognitoUserPoolId, // Your user pool id here
        ClientId: environment.aws.cognitoAppClientId, // Your client id here
      };
      let userPool = new CognitoUserPool(poolData);
      let userData = { Username: this.emailAddress, Pool: userPool };
      var cognitoUser = new CognitoUser(userData);
      cognitoUser.confirmPassword(formData.otp, formData.intialPassword,  {
        onSuccess: (result: any) => {
          this.toastr.success('OTP verified - Password reset successfully , Please signIn', 'Success');
          this.router.navigate(['/sign-in']);      
        },
        onFailure: (err: any) => {
          this.toastr.error(err?.message, 'Error');
        },
      });
    } else {
      this.toastr.error('Please fill all the Fields', 'Error');
    }
  }

  sendOtp() {
    let poolData = {
      UserPoolId: environment.aws.cognitoUserPoolId, // Your user pool id here
      ClientId: environment.aws.cognitoAppClientId, // Your client id here
    };
    let userPool = new CognitoUserPool(poolData);
    let userData = { Username: this.emailAddress, Pool: userPool };
    var cognitoUser = new CognitoUser(userData);
    this.isLoading = true;
    cognitoUser.forgotPassword({
      onSuccess: (result: any) => {
        this.isLoading = false;        
        this.toastr.success('OTP Send to your email address', 'Success');
        this.firstStep = false;      
      },
      onFailure: (err: any) => {
        this.isLoading = false;        
        this.toastr.error('There is an error in sending otp', 'Error');
      },
    });
  }
}
