import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeSalesDetailsPage } from './employee-sales-details.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeeSalesDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeSalesDetailsPageRoutingModule {}
