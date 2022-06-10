import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription, interval } from "rxjs";
import * as moment from "moment";

@Component({
  selector: "app-clock",
  templateUrl: "./clock.component.html",
  styleUrls: ["./clock.component.css"],
})
export class ClockComponent implements OnInit, OnDestroy {
  constructor() {}

  private subscription: Subscription = new Subscription();

  //public dDay = new Date('Mar 21 2022 18:00:00');
  //public dDayUTC = new Date('21 Mar 2022 12:30:00');
  //public dDay = new Date('Mar 02 2022 18:00:00').toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
  public dDay = new Date(
    "2022-03-21T18:00:00.000+05:30"
  ); /* midnight in China on April 13th */

  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;

  public timeDifference: any;
  public secondsToDday: any;
  public minutesToDday: any;
  public hoursToDday: any;
  public daysToDday: any;

  private getTimeDifference(): void {
    const now = new Date();
    this.timeDifference =
      this.dDay.getTime() - (now.getTime() + 60 * 60 * 1000 * 1000);
    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits(timeDifference: any): void {
    this.secondsToDday = Math.floor(
      (timeDifference / this.milliSecondsInASecond) % this.SecondsInAMinute
    );
    this.secondsToDday = this.fillZero(this.secondsToDday);

    this.minutesToDday = Math.floor(
      (timeDifference / (this.milliSecondsInASecond * this.minutesInAnHour)) %
        this.SecondsInAMinute
    );
    this.minutesToDday = this.fillZero(this.minutesToDday);

    this.hoursToDday = Math.floor(
      (timeDifference /
        (this.milliSecondsInASecond *
          this.minutesInAnHour *
          this.SecondsInAMinute)) %
        this.hoursInADay
    );
    this.hoursToDday = this.fillZero(this.hoursToDday);

    this.daysToDday = Math.floor(
      timeDifference /
        (this.milliSecondsInASecond *
          this.minutesInAnHour *
          this.SecondsInAMinute *
          this.hoursInADay)
    );
    this.daysToDday = this.fillZero(this.daysToDday);
  }

  private fillZero(value: any): string {
    if (value < 9) {
      return "0" + value;
    }
    return value;
  }
  ngOnInit(): void {
    this.subscription = interval(1000).subscribe((x) => {
      this.getTimeDifference();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
