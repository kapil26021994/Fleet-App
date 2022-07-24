import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpConfigInterceptor } from '../../core/interceptor/httpconfig.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MyOrdersPage } from './my-orders.page';

const routes: Routes = [
  {
    path: '',
    component: MyOrdersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
   ]
})
export class MyOrdersPageRoutingModule {}
