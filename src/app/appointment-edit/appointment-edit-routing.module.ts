import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppointmentEditPage } from './appointment-edit.page';

const routes: Routes = [
  {
    path: '',
    component: AppointmentEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentEditPageRoutingModule {}
