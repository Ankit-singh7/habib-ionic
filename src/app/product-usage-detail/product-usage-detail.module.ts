import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductUsageDetailPageRoutingModule } from './product-usage-detail.routing.module';

import { ProductUsageDetailPage } from './product-usage-detail.page';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductUsageDetailPageRoutingModule,
    IonicSelectableModule
  ],
  declarations: [ProductUsageDetailPage]
})
export class ProductUsageDetailPageModule {}
