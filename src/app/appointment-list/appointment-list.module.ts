import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppointmentListPageRoutingModule } from './appointment-list-routing.module';

import { AppointmentListPage } from './appointment-list.page';
import { FilterPipe } from '../shared/pipe/filter.pipe';
import { ClipboardModule } from '@angular/cdk/clipboard';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppointmentListPageRoutingModule,
    ClipboardModule
  ],
  declarations: [AppointmentListPage,FilterPipe]
})
export class AppointmentListPageModule {}
