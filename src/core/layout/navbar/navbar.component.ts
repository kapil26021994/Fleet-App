import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import{AuthenticationService} from 'src/core/services/authentication/authentication.service';
import {Router} from '@angular/router';
import { AppComponent } from 'src/modules/app.component';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavbarComponent implements OnInit {
  public iconOnlyToggled = false;
  public sidebarToggled = false;
  public currentUserData :any;
  public isMobileView = false;
  public currentCompanyLogo :any;
  
  constructor(config: NgbDropdownConfig,
    public auth:AuthenticationService,
    public appComponent : AppComponent,
    public router:Router) {
    config.placement = 'bottom-right';
  }

  ngOnInit() {
    this.currentCompanyLogo = localStorage.getItem('logo');
    this.currentUserData =  this.auth.getLoggedInUser();
    this.listenMobileEvent();
  }

  listenMobileEvent(){
    if(/Android|iPhone/i.test(navigator.userAgent)){
      this.isMobileView=true;
    }
    this.appComponent.resizeObservable$.subscribe( (evt:any) => {
      if(/Android|iPhone/i.test(navigator.userAgent)){
        this.isMobileView=true;
      }else{
        this.isMobileView=false;
      }
    })
  }

  // toggle sidebar in small devices
  toggleOffcanvas() {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  }

  // toggle sidebar
  toggleSidebar() {
    let body = document.querySelector('body');
    if((!body.classList.contains('sidebar-toggle-display')) && (!body.classList.contains('sidebar-absolute'))) {
      this.iconOnlyToggled = !this.iconOnlyToggled;
      if(this.iconOnlyToggled) {
        body.classList.add('sidebar-icon-only');
      } else {
        body.classList.remove('sidebar-icon-only');
      }
    } else {
      this.sidebarToggled = !this.sidebarToggled;
      if(this.sidebarToggled) {
        body.classList.add('sidebar-hidden');
      } else {
        body.classList.remove('sidebar-hidden');
      }
    }
  }

  // toggle right sidebar
  logoutUser() {
    localStorage.clear();
    this.router.navigate(['/auth/']);
  }

}
