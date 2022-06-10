import { NgModule } from '@angular/core';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HeaderComponent } from './pages/header/header.component';
import { FooterComponent } from './pages/footer/footer.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { LoginHeaderComponent } from './pages/login-header/login-header.component';
import { ReferFriendsComponent } from './pages/refer-friends/refer-friends.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { RewardHistoryComponent } from './pages/reward-history/reward-history.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ClaimButtonComponent } from './pages/claim-button/claim-button.component';
import { ValidateUserComponent } from './pages/validate-user/validate-user.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { OuterPageComponent } from './pages/outer-page/outer-page.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { TermsComponent } from './pages/terms/terms.component';
import { RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings, RecaptchaV3Module, RECAPTCHA_SETTINGS, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from './auth/token-interceptor.service';
import { ClockComponent } from './pages/dashboard/clock/clock.component';
import { Subscription } from 'rxjs';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    ProfileComponent,
    PageNotFoundComponent,
    SignInComponent,
    SignUpComponent,
    ResetPasswordComponent,
    LoginHeaderComponent,
    ReferFriendsComponent,
    ChangePasswordComponent,
    RewardHistoryComponent,
    ClaimButtonComponent,
    ValidateUserComponent,
    OuterPageComponent,
    PrivacyComponent,
    TermsComponent,
    ClockComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    NgIdleKeepaliveModule.forRoot(),
    RecaptchaV3Module,
    RecaptchaModule,
    RecaptchaFormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.siteKeyV2,
      } as RecaptchaSettings,
    },
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptcha.siteKeyV3
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  // constructor()
}
