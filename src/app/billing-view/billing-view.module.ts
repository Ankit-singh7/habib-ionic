import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BillingViewPageRoutingModule } from './billing-view-routing.module';

import { BillingViewPage } from './billing-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BillingViewPageRoutingModule
  ],
  declarations: [BillingViewPage]
})
export class BillingViewPageModule {}
