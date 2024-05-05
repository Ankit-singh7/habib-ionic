import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeSalesDetailsPageRoutingModule } from './employee-sales-details.routing.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { EmployeeSalesDetailsPage } from './employee-sales-details.page';
import { FilterPipe } from '../shared/pipe/filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    EmployeeSalesDetailsPageRoutingModule
  ],
  declarations: [EmployeeSalesDetailsPage, FilterPipe]
})
export class EmployeeSalesDetailsPageModule {}
