import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-refer-friends',
  templateUrl: './refer-friends.component.html',
  styleUrls: ['./refer-friends.component.css'],
})
export class ReferFriendsComponent implements OnInit {
  @Input() profileInfo: any;
  referralcode: any;
  rewardsInfo: any;
  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {
    this.referralcode =
      'https://fans.sportzchain.com/signup?referral=' +
      this.profileInfo.referralcode;
  }

  copyMessage() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.profileInfo.referralcode;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toastr.success('Copied to clipboard', 'Success');
  }

  facebookShare() {
    window.open(
      'https://www.facebook.com/sharer/sharer.php?u=https://fans.sportzchain.com/signup%3Freferral%3D' +
        this.profileInfo.referralcode +
        '&quote=Hey%2C%20%0AI%20am%20using%20sportzchain%20and%20enjoying%20the%20exclusive%20team%20content.%20I%20have%20just%20sent%20you%20my%20referral%20link%2C%20https%3A%2F%2Ffans.sportzchain.com%2Fsignup%3Freferral%3D' +
        this.profileInfo.referralcode +
        '%0AUse%20this%20to%20sign%20up%20and%20get%20reward%20points.%20%0A%0ADont%20let%20your%20favourite%20teams%20hanging%2C%20sign%20up%20now%21%21%21',
      '_blank'
    );
  }

  whatsappShare() {
    window.open(
      'https://api.whatsapp.com/send?text=Hey%2C%20%0AI%20am%20using%20sportzchain%20and%20enjoying%20the%20exclusive%20team%20content.%20I%20have%20just%20sent%20you%20my%20referral%20link%2C%20https%3A%2F%2Ffans.sportzchain.com%2Fsignup%3Freferral%3D' +
        this.profileInfo.referralcode +
        '%0AUse%20this%20to%20sign%20up%20and%20get%20reward%20points.%20%0A%0ADont%20let%20your%20favourite%20teams%20hanging%2C%20sign%20up%20now%21%21%21',
      '_blank'
    );
  }

  twitterShare() {
    window.open(
      'https://twitter.com/intent/tweet?text=Hey%2C%20%0AI%20am%20using%20sportzchain%20and%20enjoying%20the%20exclusive%20team%20content.%20I%20have%20just%20sent%20you%20my%20referral%20link%2C%20https%3A%2F%2Ffans.sportzchain.com%2Fsignup%3Freferral%3D' +
        this.profileInfo.referralcode +
        '%0AUse%20this%20to%20sign%20up%20and%20get%20reward%20points.%20%0A%0ADont%20let%20your%20favourite%20teams%20hanging%2C%20sign%20up%20now%21%21%21',
      '_blank'
    );
  }

  telegramShare() {
    window.open(
      'https://telegram.me/share/url?url=https://fans.sportzchain.com/signup%3Freferral%3D' +
        this.profileInfo.referralcode +
        '&text=Hey%2C%20%0AI%20am%20using%20sportzchain%20and%20enjoying%20the%20exclusive%20team%20content.%20I%20have%20just%20sent%20you%20my%20referral%20link%2C%20https%3A%2F%2Ffans.sportzchain.com%2Fsignup%3Freferral%3D' +
        this.profileInfo.referralcode +
        '%0AUse%20this%20to%20sign%20up%20and%20get%20reward%20points.%20%0A%0ADont%20let%20your%20favourite%20teams%20hanging%2C%20sign%20up%20now%21%21%21',
      '_blank'
    );
  }
}
