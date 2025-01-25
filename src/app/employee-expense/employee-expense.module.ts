import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeExpensePageRoutingModule } from './employee-expense-routing.module';

import { EmployeeExpensePage } from './employee-expense.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeeExpensePageRoutingModule
  ],
  declarations: [EmployeeExpensePage]
})
export class EmployeeExpensePageModule {}
