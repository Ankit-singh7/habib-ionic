import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BillingViewPage } from './billing-view.page';

const routes: Routes = [
  {
    path: '',
    component: BillingViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingViewPageRoutingModule {}
