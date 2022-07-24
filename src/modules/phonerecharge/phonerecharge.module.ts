import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import{SharedModule} from 'src/shared/module/shared.module';

import { IonicModule } from '@ionic/angular';

import { PhonerechargePageRoutingModule } from './phonerecharge-routing.module';

import { PhonerechargePage } from './phonerecharge.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
	TranslateModule,     
    PhonerechargePageRoutingModule
  ],
  declarations: [PhonerechargePage]
})
export class PhonerechargePageModule {}
