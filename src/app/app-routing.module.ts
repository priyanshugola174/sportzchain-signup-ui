import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { HomeComponent } from "./pages/home/home.component";
import { ResetPasswordComponent } from "./pages/reset-password/reset-password.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { PageNotFoundComponent } from "./pages/page-not-found/page-not-found.component";
import { AuthGuard } from "./services/auth-guard.service";
import { ValidateUserComponent } from "./pages/validate-user/validate-user.component";
// { path: 'home', component: DashboardComponent, canActivate: [AuthGuard] },
import { OuterPageComponent } from "./pages/outer-page/outer-page.component";
import { PrivacyComponent } from "./pages/privacy/privacy.component";
import { TermsComponent } from "./pages/terms/terms.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "signup", component: HomeComponent},
  { path: "validate-user/:email", component: ValidateUserComponent },
  { path: "reset-password", component: ResetPasswordComponent },
  { path: "sign-in", component: OuterPageComponent },
  { path: "home", component: DashboardComponent, canActivate: [AuthGuard] },
  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
  { path: "privacy", component: PrivacyComponent },
  { path: "terms", component: TermsComponent },
  { path: "404", component: PageNotFoundComponent },
  { path: "**", redirectTo: "/404" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule {}
