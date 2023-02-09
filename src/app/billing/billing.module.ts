import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BillingPageRoutingModule } from './billing-routing.module';

import { BillingPage } from './billing.page';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BillingPageRoutingModule,
    IonicSelectableModule
  ],
  declarations: [BillingPage]
})
export class BillingPageModule {}
