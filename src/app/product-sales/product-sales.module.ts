import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductSalesPageRoutingModule } from './product-sales-routing.module';

import { ProductSalesPage } from './product-sales.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { FilterPipe } from '../shared/pipe/filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    ProductSalesPageRoutingModule
  ],
  declarations: [ProductSalesPage, FilterPipe]
})
export class ProductSalesPageModule {}
