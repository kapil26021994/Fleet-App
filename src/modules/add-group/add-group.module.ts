import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import{SharedModule} from 'src/shared/module/shared.module';
import { IonicModule } from '@ionic/angular';

import { AddGroupPageRoutingModule } from './add-group-routing.module';

import { AddGroupPage } from './add-group.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,SharedModule,
    AddGroupPageRoutingModule
  ],
  declarations: [AddGroupPage]
})
export class AddGroupPageModule {}
