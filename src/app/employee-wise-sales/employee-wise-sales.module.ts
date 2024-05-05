import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeWiseSalesPageRoutingModule } from './employee-wise-sales-routing.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { EmployeeWiseSalesPage } from './employee-wise-sales.page';
import { FilterPipe } from '../shared/pipe/filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    EmployeeWiseSalesPageRoutingModule
  ],
  declarations: [EmployeeWiseSalesPage, FilterPipe]
})
export class EmployeeWiseSalesPageModule {}
