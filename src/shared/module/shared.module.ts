import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpConfigInterceptor } from '../../core/interceptor/httpconfig.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import{CommonDataListComponent}from 'src/shared/components/common-data-list/common-data-list.component';
import { IonicModule } from '@ionic/angular';
import { ConfirmationDialog } from 'src/shared/components/confirmation-dialog/confirmation-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {
  MatTableModule,
  MatButtonModule,
  MatFormFieldModule,
  MatTabsModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatIconModule,
  MatPaginatorModule,
  MatMenuModule,
  MatSortModule
} from "@angular/material";


@NgModule({
  declarations: [CommonDataListComponent,ConfirmationDialog],
  entryComponents: [ConfirmationDialog],
  imports: [
    RouterModule,
    CommonModule,
    MatChipsModule,
    MatTableModule,
    FormsModule,
    MatDialogModule,
    MatOptionModule,
    MatPaginatorModule,
    MatTabsModule,
    IonicModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatSelectModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  exports:[FormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatTabsModule,
    MatIconModule,
    MatInputModule,
    MatSortModule,
    IonicModule,
    MatChipsModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    CommonModule,
    MatMenuModule,
    CommonDataListComponent,
    ConfirmationDialog,
    MatProgressSpinnerModule,
    ReactiveFormsModule],
    providers: [
      ToastrService,
     { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    ]
})
export class SharedModule { }
