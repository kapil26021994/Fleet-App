import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-info',
  templateUrl: './item-info.page.html',
  styleUrls: ['./item-info.page.scss'],
})
export class ItemInfoPage implements OnInit {
select_size: string = "XL";
select_color: string = "light_blue";
favorite_icon = false;	
  constructor() { }

  ngOnInit() {
  }

toggleSaveIcon1() {
    this.favorite_icon = !this.favorite_icon;
  }
}
