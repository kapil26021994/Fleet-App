import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
// import { MapComponent } from 'src/shared/components/map/map.component';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'mall',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../mall/mall.module').then(m => m.MallPageModule)
          }
        ]
      },
	   {
        path: 'orders',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../my-orders/my-orders.module').then(m => m.MyOrdersPageModule)
          }
        ]
      },  
      {
        path: 'myprofile',
        loadChildren: () => import('../myprofile/myprofile.module').then( m => m.MyprofilePageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
