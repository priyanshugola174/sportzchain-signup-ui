import { Component, OnInit } from "@angular/core";
import { ProfileService } from "../../services/profile.service";
import { Validators, FormBuilder } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { environment as env } from "../../../environments/environment";
import { countries } from "src/app/models/countries";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  showWalletTooltipInfo: boolean = false;
  currentContainer: any = "profile";
  isLoading: boolean = false;
  isDataLoaded: boolean = false;
  profileInfo: any;
  rewardsInfo: any;
  countryList: any;

  profileForm = this.formBuilder.group({
    userSub: ["", []],
    displayname: ["", [Validators.required]],
    walletaddress: ["", []],
    age: ["", []],
    gender: ["", []],
    country: ["", []],
    bio: ["", []],
    facebook: ["", []],
    twitter: ["", []],
    instagram: ["", []],
    telegram: ["", []],
    discord: ["", []],
  });

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProfileInfo();
    this.countryList = countries;
  }

  onUpdate() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      var updateInput = this.profileForm.value;
      if (!updateInput.age) {
        updateInput.age = 0;
      } else {
        if (updateInput.age < 10 || updateInput.age > 90) {
          this.toastr.error("Please enter the age between 16 and 90", "Error");
          return;
        }
      }

      this.profileService.updateProfile(updateInput).subscribe(
        (resp) => {
          this.isLoading = false;
          this.toastr.success("Profile Updated Successfully", "Success");
        },
        (error) => {
          this.isLoading = false;
          this.toastr.error(
            "There is something went wrong, try again later",
            "Error"
          );
        }
      );
    } else {
      this.toastr.error("Please fill the mandatory fields", "Error");
    }
  }

  loadProfileInfo() {
    this.isLoading = true;
    this.isDataLoaded = false;
    this.profileService.profileInfo().subscribe(
      (resp) => {
        this.isDataLoaded = true;
        this.profileInfo = JSON.parse(resp.body);
        let userSession = JSON.parse(
          sessionStorage.getItem("userSession") || "{}"
        );
        this.profileForm.patchValue({
          userSub: userSession.accessToken.payload.username,
          displayname: this.profileInfo.profile.displayname,
          walletaddress: this.profileInfo.profile.walletaddress,
          age:
            this.profileInfo.profile.age === 0
              ? ""
              : this.profileInfo.profile.age,
          gender: this.profileInfo.profile.gender,
          country: this.profileInfo.profile.country,
          bio: this.profileInfo.profile.bio,
          facebook: this.profileInfo.profile.facebook,
          twitter: this.profileInfo.profile.twitter,
          instagram: this.profileInfo.profile.instagram,
          telegram: this.profileInfo.profile.telegram,
          discord: this.profileInfo.profile.discord,
        });
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }
  showWalletTooltip() {
    this.showWalletTooltipInfo = true;
  }
  activeContainer(menuName: any) {
    this.currentContainer = menuName;
  }
}
