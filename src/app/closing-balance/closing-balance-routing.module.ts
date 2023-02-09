import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClosingBalancePage } from './closing-balance.page';

const routes: Routes = [
  {
    path: '',
    component: ClosingBalancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClosingBalancePageRoutingModule {}
