import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppointmentEditPageRoutingModule } from './appointment-edit-routing.module';

import { AppointmentEditPage } from './appointment-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppointmentEditPageRoutingModule
  ],
  declarations: [AppointmentEditPage]
})
export class AppointmentEditPageModule {}
