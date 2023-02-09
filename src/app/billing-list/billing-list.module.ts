import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BillingListPageRoutingModule } from './billing-list-routing.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { BillingListPage } from './billing-list.page';
import { FilterPipe } from '../shared/pipe/filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    BillingListPageRoutingModule
  ],
  declarations: [BillingListPage, FilterPipe]
})
export class BillingListPageModule {}
