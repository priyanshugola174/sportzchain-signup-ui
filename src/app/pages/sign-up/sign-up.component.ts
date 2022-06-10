import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { SignUpService } from "src/app/services/sign-up.service";
import { environment } from 'src/environments/environment';
import { signUpForm } from '../../models/interfaces';
import {
  CognitoUserPool,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
// import custom validator  class
import { CustomValidators } from '../../providers/custom-validator';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';
import { ReCaptchaV3Service } from 'ng-recaptcha';


@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.css"],
})
export class SignUpComponent implements OnInit {
  //token: string|undefined;
  isLoading: boolean = false;
  showPromoOption: boolean = true;
  isPromo: boolean = false;
  @Output() signInClicked: EventEmitter<any> = new EventEmitter();
  signUpForm = this.formBuilder.group({
    displayName: ["", Validators.required],
    emailAddress: ["", [Validators.required, Validators.email]],
    intialPassword: ["", [Validators.required, Validators.minLength(8)]],
    // confirmPassword: ['', [ Validators.required, CustomValidators.mustMatch('intialPassword', 'confirmPassword')]],
    confirmPassword: ["", [Validators.required]],
    agreementCheck: ["", Validators.required],
    isPromo: [false, Validators.required],
    promoCode: ["", []],
    //recaptcha: ["", [Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private signUpService: SignUpService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private route: ActivatedRoute
  ) {
    //this.token = undefined;
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      filter( (params: any) => params.referral)
      ).subscribe((params: any) => {
        console.log(params.referral); // { order: "popular" }
        this.showPromoCode()
        this.signUpForm.controls['promoCode'].setValue(params.referral);
      }
    );
  }

  get f() {
    return this.signUpForm.controls;
  }

  validateEmailPattern(email: string): boolean {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return false;
    }
    return true;
  }

  validateEmailDomain(email: string): boolean {
    var filteredDomain = environment.filteredDomain.domains.split(",");
    if (email) {
      for (var i = 0; i < filteredDomain.length; i++) {
        if (email.includes(filteredDomain[i])) {
          return true;
        }
      }
    }
    return false;
  }

  validatePasswordPattern(password: string): boolean {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^*&?.])[A-Za-z\d!@#$%^*&?.]{8,15}$/;
    const isValidPassword = passwordRegex.test(password);
    return isValidPassword;
  }

  validateData(signupEvent: any): [string, string] {
    let statusCode = "success";
    let statusMessage = "success";
    //validate displayname
    if (!signupEvent.displayName) {
      statusCode = "error";
      statusMessage = "Please enter a valid display name";
      return [statusCode, statusMessage];
    }
    //validate for domain filter and email pattern
    if (
      this.validateEmailDomain(signupEvent.emailAddress) ||
      this.validateEmailPattern(signupEvent.emailAddress)
    ) {
      //Invalid email return error
      statusCode = "error";
      statusMessage = "Invalid email address. Please re-enter the email";
      return [statusCode, statusMessage];
    }
    //validate password
    if (!this.validatePasswordPattern(signupEvent.intialPassword)) {
      //Invalid password
      statusCode = "error";
      statusMessage =
        "Password should be minumum length of 8 with special character and alphanumeric characters";
      return [statusCode, statusMessage];
    }
    if (signupEvent.intialPassword !== signupEvent.confirmPassword) {
      //Password didn't match
      statusCode = "error";
      statusMessage =
        "Entered passwords don't match. Please re-enter the password";
      return [statusCode, statusMessage];
    }
    return [statusCode, statusMessage];
  }

  onSubmit() {
    // Example starter JavaScript for disabling form submissions if there are invalid fields
    (function () {
      "use strict";

      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.querySelectorAll(".needs-validation");

      // Loop over them and prevent submission
      Array.prototype.slice.call(forms).forEach(function (form) {
        form.addEventListener(
          "submit",
          function (event: any) {
            if (!form.checkValidity()) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.classList.add("was-validated");
          },
          false
        );
      });
    })();

    if (this.signUpForm.valid) {
      //console.debug(`Token [${this.token}] generated`);
      this.recaptchaV3Service.execute('signup')
      .subscribe((token) => this.handleToken(token));
      
      let formInput = this.signUpForm.value;
      // validation
      let [statusCode, statusMessage] = this.validateData(formInput);
      if (statusCode === "error") {
        this.toastr.error(statusMessage, "Error");
        return;
      }
      this.isLoading = true;
      var poolData = {
        UserPoolId: environment.aws.cognitoUserPoolId, // Your user pool id here
        ClientId: environment.aws.cognitoAppClientId, // Your client id here
      };
      var userPool = new CognitoUserPool(poolData);
      var attributeList = [];
      let formData: signUpForm = {
        'custom:promocode': formInput.promoCode,
        'custom:displayname': formInput.displayName,
        email: formInput.emailAddress,
      };

      for (let key in formData) {
        let attrData = {
          Name: key,
          Value: formData[key],
        };
        let attribute = new CognitoUserAttribute(attrData);
        attributeList.push(attribute);
      }
      userPool.signUp(
        formInput.emailAddress,
        formInput.intialPassword,
        attributeList,
        [],
        (err, result) => {
          this.isLoading = false;
          if (err) {
            console.log('Error: ', err)
            if(err.name === 'NotAuthorizedException'){
              this.toastr.error("Error in signing up the user. Please try again later", 'Error');  
            }else{
              this.toastr.error(err.message || JSON.stringify(err), 'Error');
            }
            return;
          } else {
            this.toastr.success(
              'SignUp completed, Please update your OTP is sent to your email',
              'Success'
            );
            this.signUpForm.reset();
            this.router.navigate(['/validate-user/'+formInput.emailAddress]);
            //this.signInClick();
          }
        }
      );
      
    }
  }

  showPromoCode() {
    this.showPromoOption = false;
    this.isPromo = true;
  }

  closePromo() {
    this.showPromoOption = true;
    this.isPromo = false;
    this.signUpForm.controls['promoCode'].setValue('');
  }

  signInClick() {
    this.signInClicked.emit("signIn");
  }

  public executeImportantAction(): void {}

  handleToken(token: any): void {
    console.debug(`Token [${token}] generated`);
  }
}
