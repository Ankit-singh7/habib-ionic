import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BillingListPage } from './billing-list.page';

const routes: Routes = [
  {
    path: '',
    component: BillingListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingListPageRoutingModule {}
