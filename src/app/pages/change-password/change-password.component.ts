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
import { ProfileService } from '../../services/profile.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  isLoading: boolean = false;
  emailAddress: any;
  changePasswordForm = this.formBuilder.group({
    currentPassword: ['', [Validators.required]],
    intialPassword: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]]
  });
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private profileService: ProfileService, 
    private loginService: LoginService    
    ) { 
      
    }

  ngOnInit(): void {
    this.loadProfileInfo();
  }

  loadProfileInfo() {
    this.profileService.profileInfo().subscribe(
      (resp) => {
        let profileUser = JSON.parse(resp.body);
        this.emailAddress = profileUser.profile.email;
      },
      (error) => {
      }
    );
  }

  onSubmit() {
    if(this.changePasswordForm.valid) {
      let formData = this.changePasswordForm.value;
      let poolData = {
        UserPoolId: environment.aws.cognitoUserPoolId, // Your user pool id here
        ClientId: environment.aws.cognitoAppClientId, // Your client id here
      };
      let userPool = new CognitoUserPool(poolData);
      let userData = { Username: this.emailAddress, Pool: userPool };
      var cognitoUser = new CognitoUser(userData);
      this.isLoading = true;
      const currentUser: any = userPool.getCurrentUser();
      if (currentUser) {
        currentUser.getSession((err: any, session: any) => {
          if (err) {
              this.toastr.error('Error in getting user session', 'Error');
          } else {
            currentUser.changePassword(formData.currentPassword, formData.intialPassword,
            (error: any, result: any) => {
              if (error) {
                this.toastr.error('Error in change password', 'Error');
              } else {
                this.toastr.success('New Password Updated Successfully', 'Success');
                this.onLogout();
                //this.router.navigate(['/sign-in']);
              }
            });
          }
        });
      } else {
        this.toastr.error('User is not authenticated', 'Error');
      }
    } else {
      this.toastr.error('Please fill all the fields', 'Error');
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
    cognitoUser.resendConfirmationCode(
      (err, result) => {
        this.isLoading = false;
        if(err) {
          this.toastr.error(err?.message, 'Error');
        } else {
          this.toastr.success('OTP Send to your email address', 'Success');
        }
      }
    );
  }

  onLogout(): void {
    this.loginService.logout();
    this.router.navigate(['/sign-in']);
  }

}
