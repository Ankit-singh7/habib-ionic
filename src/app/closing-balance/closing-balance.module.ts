import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClosingBalancePageRoutingModule } from './closing-balance-routing.module';

import { ClosingBalancePage } from './closing-balance.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClosingBalancePageRoutingModule
  ],
  declarations: [ClosingBalancePage]
})
export class ClosingBalancePageModule {}
