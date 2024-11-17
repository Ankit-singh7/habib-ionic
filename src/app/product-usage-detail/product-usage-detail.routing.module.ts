import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductUsageDetailPage } from './product-usage-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ProductUsageDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductUsageDetailPageRoutingModule {}
