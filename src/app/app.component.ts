import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../src/app/services/login.service';
import { Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core'
import { Keepalive } from '@ng-idle/keepalive';
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent implements OnInit {
  title = 'SportZchain';
  currentName: string = ''; 
  isLoggedIn: any;
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = new Date();
  

  constructor(
    private router: Router, 
    private loginService: LoginService, 
    private idle: Idle,
    private toastr: ToastrService,
    private keepalive: Keepalive) {
      idle.setIdle(environment.timeout.timeout);
      idle.setTimeout(environment.timeout.timeoutWarning);
      idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

      idle.onIdleEnd.subscribe(() => { 
        this.idleState = 'No longer idle.'
        this.reset();
      });

      idle.onTimeout.subscribe(() => {
        this.idleState = 'Timed out!';
        this.timedOut = true;
        this.onLogout()
      });
      idle.onIdleStart.subscribe(() => {
        this.idleState = 'You\'ve gone idle!'
      });
      idle.onTimeoutWarning.subscribe((countdown) => {
        this.idleState = 'You will time out in ' + countdown + ' seconds!';
        //this.toastr.info(this.idleState)
      });

      // sets the ping interval to 15 seconds
      keepalive.interval(15);

      keepalive.onPing.subscribe(() => this.lastPing = new Date());

      loginService.getIsUserLoggedIn().subscribe(isUserLoggedIn => {
        if (isUserLoggedIn) {
          idle.watch()
          this.timedOut = false;
        } else {
          idle.stop();
        }
      })

    }
    
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  ngOnInit(): void {
    this.checkLogin();
  }
  
  isShowMenu(): boolean {
    this.checkLogin();
    return this.isLoggedIn;
  }

  checkLogin(): void {
    if(sessionStorage.getItem('isLoggedIn') !== null) {
      let value:any = sessionStorage.getItem('isLoggedIn');  
      this.isLoggedIn = JSON.parse(value);
      this.currentName = this.loginService.getUserName();
    } else {
      this.isLoggedIn = false;
    }
  }
  onLogout(): void {
    this.loginService.logout();
    this.checkLogin();
    this.router.navigate(['/']);
  } 
}
