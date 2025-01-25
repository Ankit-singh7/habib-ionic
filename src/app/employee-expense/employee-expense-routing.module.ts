import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeExpensePage } from './employee-expense.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeeExpensePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeExpensePageRoutingModule {}
