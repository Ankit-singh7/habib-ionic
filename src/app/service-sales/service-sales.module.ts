import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceSalesPageRoutingModule } from './service-sales-routing.module';

import { ServiceSalesPage } from './service-sales.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { FilterPipe } from '../shared/pipe/filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    ServiceSalesPageRoutingModule
  ],
  declarations: [ServiceSalesPage,FilterPipe]
})
export class ServiceSalesPageModule {}
