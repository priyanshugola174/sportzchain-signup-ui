import { Component, OnInit } from "@angular/core";
import { ProfileService } from "../../services/profile.service";

@Component({
  selector: "app-reward-history",
  templateUrl: "./reward-history.component.html",
  styleUrls: ["./reward-history.component.css"]
})
export class RewardHistoryComponent implements OnInit {
  isLoading: boolean = false;
  rewardData: any;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadRewards();
  }

  loadRewards() {
    this.isLoading = true;
    this.profileService.rewardHistory().subscribe(
      (resp) => {
        this.isLoading = false;
        this.rewardData = JSON.parse(resp.body);
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }
}
