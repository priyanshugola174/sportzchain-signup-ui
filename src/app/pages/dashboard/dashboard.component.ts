import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import { ProfileService } from "../../services/profile.service";
import { MenuService } from "../../services/menu.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { Subscription, interval } from "rxjs";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  expired: boolean = true;
  isError: boolean = false;
  errorMessage: any;
  social: any;
  subscription: any;
  item: any;
  currentDate: any;
  targetDate: any;
  cDateMillisecs: any;
  tDateMillisecs: any;
  difference: any;
  seconds: any;
  minutes: any;
  hours: any;
  days: any;
  year: number = 2022;
  month: number = 11;
  months = [
    "Jan",
    "Feb",
    "Mar",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  day: number = 31;
  showComingSoontipInfo = false;
  @ViewChild("showDays") showDays: any;
  @ViewChild("showHours") showHours: any;
  @ViewChild("showMinutes") showMinutes: any;
  @ViewChild("showSeconds") showSeconds: any;
  isLoading: boolean = false;
  isDataLoaded: boolean = false;
  profileInfo: any;
  rewardsInfo: any;
  x: any;
  constructor(
    private router: Router,
    private profileService: ProfileService,
    private toastr: ToastrService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.loadProfileInfo();
    //this.countTimer();
    this.menuService.menuClickedEvent.subscribe((data: string) => {
      this.scrollHandler(data);
    });
  }

  scrollHandler(menu: any) {
    if (menu) {
      let el = document.getElementById(menu);
      if (el != undefined) {
        el.scrollIntoView();
      }
    }
  }

  loadProfileInfo() {
    // this.isDataLoaded = true;
    // this.profileInfo = {"profile":{"displayname":"user1","walletaddress":"0x1234567890ABCDEFGH1324567890","age":30,"gender":"M","bio":"This is my bio","referralcode":"K26Y7V08I3","social":{"facebook":"facebookuser","instagram":"instagramuser","twitter":"twitteruser","telegram":"telegramuser","discord":"discorduser"},"rewards":{"totalreferrals":2,"totalrewards":50,"totalratio":25,"join":{"telegram":"claim","sportzchain":"claimed","discord":"pending"},"profile":{"erc20wallter":"claim","completeprofile":"claim"},"followus":{"facebook":"claimed","instagram":"pending","twitter":"claim"}}}}
    // this.rewardsInfo = this.profileInfo.profile.rewards;
    this.isLoading = true;
    this.isDataLoaded = false;
    this.profileService.profileInfo().subscribe(
      (resp) => {
        this.isDataLoaded = true;
        this.profileInfo = JSON.parse(resp.body);
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    //this.subscription.unsubscribe();
    clearInterval(this.x);
    // release our intervalID from the variable
    this.x = null;
  }

  private fillZero(value: any): any {
    if (value < 9) {
      return "0" + value;
    }
    return "" + value;
  }

  private timerSubs: Subscription = new Subscription();

  updateTime(): any {
    // Set the date we're counting down to
    var startdate = environment.launchdate.date;
    var countDownDate = new Date(startdate).getTime();
    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="demo"
    // const myAbsolutelyNotNullElement = window.document.getElementById("demo")!
    // myAbsolutelyNotNullElement.innerHTML = days + "d " + hours + "h "
    // + minutes + "m " + seconds + "s ";

    const showdays = window.document.getElementById("showdays")!;
    if (days < 9) {
      showdays.innerHTML = "0" + days + "";
    } else {
      showdays.innerHTML = days + "";
    }

    const showhours = window.document.getElementById("showhours")!;
    if (hours < 9) {
      showhours.innerHTML = "0" + hours + "";
    } else {
      showhours.innerHTML = hours + "";
    }

    const showminutes = window.document.getElementById("showminutes")!;
    if (minutes < 9) {
      showminutes.innerHTML = "0" + minutes + "";
    } else {
      showminutes.innerHTML = minutes + "";
    }

    const showseconds = window.document.getElementById("showseconds")!;
    if (seconds < 9) {
      showseconds.innerHTML = "0" + seconds + "";
    } else {
      showseconds.innerHTML = seconds + "";
    }

    // If the count down is finished, write some text
    if (distance < 0) {
      // const expired = window.document.getElementById("expired")!;
      // expired.innerHTML = "Wow! We are Live now";
      this.expired = true;
    }
  }
  countTimer() {
    this.timerSubs = interval(1000).subscribe((x) => {
      this.updateTime();
    });
  }

  ngAfterViewInit() {
    //this.myTimer();
  }

  claimJoin(userReadable: any, identifier: any, data: any) {
    this.isError = false;
    this.social = {};
    if (data == "") {
      this.isError = true;
      this.errorMessage =
        "Please update the " +
        userReadable +
        " information in the profile page to continue.";
      setInterval(() => {
        this.isError = false;
        this.errorMessage = "";
      }, 5000);
    } else {
      this.social[identifier] = true;
      this.profileService.claimBonus(identifier, data).subscribe(
        (resp) => {
          this.social[identifier] = true;
          this.changeStatus(identifier);
        },
        (error) => {
          this.social[identifier] = true;
          this.toastr.error(
            "Something went wrong, please try again later",
            "Error"
          );
        }
      );
    }
    this.scrollHandler("claim");
  }

  changeStatus(identifier: any) {
    if (identifier == "jointelegram") {
      this.profileInfo.profile.jointelegram = "pending";
    }
    if (identifier == "joindiscord") {
      this.profileInfo.profile.joindiscord = "pending";
    }
    if (identifier == "sportzchainsignup") {
      this.profileInfo.profile.sportzchainsignup = "pending";
    }
    if (identifier == "addercwallet") {
      this.profileInfo.profile.addercwallet = "pending";
    }
    if (identifier == "completeprofile") {
      this.profileInfo.profile.completeprofile = "pending";
    }
    if (identifier == "followtwitter") {
      this.profileInfo.profile.followtwitter = "pending";
    }
    if (identifier == "followfacebook") {
      this.profileInfo.profile.followfacebook = "pending";
    }
    if (identifier == "followinstagram") {
      this.profileInfo.profile.followinstagram = "pending";
    }
  }

  claimProfile(userReadable: any, identifier: any) {
    this.isError = false;
    this.social = {};
    if (
      this.profileInfo.profile.age === 0 ||
      !this.profileInfo.profile.gender ||
      !this.profileInfo.profile.bio ||
      !this.profileInfo.profile.country
    ) {
      this.isError = true;
      this.errorMessage =
        "Please update the " +
        userReadable +
        " information in the profile page to continue.";
      setInterval(() => {
        this.isError = false;
        this.errorMessage = "";
      }, 5000);
    } else {
      this.social[identifier] = true;
      this.profileService.claimBonus(identifier, "").subscribe(
        (resp) => {
          this.social[identifier] = true;
          this.changeStatus(identifier);
        },
        (error) => {
          this.social[identifier] = true;
          this.toastr.error(
            "There is something went wrong, try again later",
            "Error"
          );
        }
      );
    }
  }

  showComingSoon(): void {
    /**/
    if (this.expired == true) {
      window.open(environment.external.ngagen, "_blank");
    } else {
      this.showComingSoontipInfo = true;
      setTimeout(() => {
        this.showComingSoontipInfo = false; // set this to false if we need to hide the message after 3 secs
      }, 5000);
    }
  }
}
