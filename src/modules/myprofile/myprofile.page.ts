import { Component, OnInit } from '@angular/core';
import {Router } from '@angular/router';
@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.page.html',
  styleUrls: ['./myprofile.page.scss'],
})
export class MyprofilePage implements OnInit {
public currentUseData:any;
public companyLogo :any;
  constructor(public router:Router) { }

  ngOnInit() {
    this.currentUseData =  JSON.parse(localStorage.getItem('user-data'));
    this.companyLogo =  localStorage.getItem('logo');
  }

  logoutUser() {
    localStorage.clear();
    this.router.navigate(['/signin']);
  }
}
