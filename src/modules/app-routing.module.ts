import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HttpConfigInterceptor } from '../core/interceptor/httpconfig.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

const routes: Routes = [
	 {
    path: '',
    redirectTo: 'signin',
    pathMatch: 'full'
  },	
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'item-info',
    loadChildren: () => import('./item-info/item-info.module').then( m => m.ItemInfoPageModule)
  },
  {
    path: 'mall',
    loadChildren: () => import('./mall/mall.module').then( m => m.MallPageModule)
  },
  {
    path: 'my-orders',
    loadChildren: () => import('./my-orders/my-orders.module').then( m => m.MyOrdersPageModule)
  },
  {
    path: 'myprofile',
    loadChildren: () => import('./myprofile/myprofile.module').then( m => m.MyprofilePageModule)
  },
  // {
  //   path: 'notification',
  //   loadChildren: () => import('./notification/notification.module').then( m => m.NotificationPageModule)
  // },
  {
    path: 'add-vehicle',
    loadChildren: () => import('./phonerecharge/phonerecharge.module').then( m => m.PhonerechargePageModule)
  },
  {
    path: 'add-company',
    loadChildren: () => import('./add-company/add-company.module').then( m => m.AddCompanyPageModule)
  },
  {
    path: 'signin',
    loadChildren: () => import('./signin/signin.module').then( m => m.SigninPageModule)
  },
  {
    path: 'add-company',
    loadChildren: () => import('./add-company/add-company.module').then( m => m.AddCompanyPageModule)
  },  {
    path: 'add-group',
    loadChildren: () => import('./add-group/add-group.module').then( m => m.AddGroupPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
   ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
