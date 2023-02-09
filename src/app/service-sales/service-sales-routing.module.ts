import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceSalesPage } from './service-sales.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceSalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceSalesPageRoutingModule {}
