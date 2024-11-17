import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContainerPage } from './container.page';
import { AuthService } from '../services/auth/auth.service';

const routes: Routes = [
  {
    path: '',
    component: ContainerPage,
    children: [

    {
      path: 'dashboard',
      loadChildren: () => import('../dashboard/dashboard.module').then( m => m.DashboardPageModule),
      canActivate: [AuthService]
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full'
    },
    {
      path: 'billing',
      loadChildren: () => import('../billing/billing.module').then( m => m.BillingPageModule),
      canActivate: [AuthService]
    },
    {
      path: 'billing-list',
      loadChildren: () => import('../billing-list/billing-list.module').then( m => m.BillingListPageModule),
      canActivate: [AuthService]
    },
    {
      path: 'billing-view',
      loadChildren: () => import('../billing-view/billing-view.module').then( m => m.BillingViewPageModule),
      canActivate: [AuthService]
    },
    {
      path: 'product-usage-detail',
      loadChildren: () => import('../product-usage-detail/product-usage-detail.module').then( m => m.ProductUsageDetailPageModule),
      canActivate: [AuthService]
    },
    {
      path: 'session',
      loadChildren: () => import('../session/session.module').then( m => m.SessionPageModule),
      canActivate: [AuthService]
    },
    {
      path: 'password-reset',
      loadChildren: () => import('../password-reset/password-reset.module').then( m => m.PasswordResetPageModule)
    },
    {
      path: 'setting',
      loadChildren: () => import('../setting/setting.module').then( m => m.SettingPageModule),
      canActivate: [AuthService]
    },
    {
      path: 'change-password',
      loadChildren: () => import('../change-password/change-password.module').then( m => m.ChangePasswordPageModule)
    },
    {
      path: 'create-appointment',
      loadChildren: () => import('../create-appointment/create-appointment.module').then( m => m.CreateAppointmentPageModule)
    },
    {
      path: 'appointment-list',
      loadChildren: () => import('../appointment-list/appointment-list.module').then( m => m.AppointmentListPageModule)
    },
    {
      path: 'appointment-edit',
      loadChildren: () => import('../appointment-edit/appointment-edit.module').then( m => m.AppointmentEditPageModule)
    },
    {
      path: 'service-sales',
      loadChildren: () => import('../service-sales/service-sales.module').then( m => m.ServiceSalesPageModule)
    },
    {
      path: 'product-sales',
      loadChildren: () => import('../product-sales/product-sales.module').then( m => m.ProductSalesPageModule)
    },
    {
      path: 'closing-balance',
      loadChildren: () => import('../closing-balance/closing-balance.module').then( m => m.ClosingBalancePageModule)
    },
    {
      path: 'employee-wise-sales',
      loadChildren: () => import('../employee-wise-sales/employee-wise-sales.module').then( m => m.EmployeeWiseSalesPageModule),
      canActivate: [AuthService]
    },
    {
      path: 'employee-sales-details',
      loadChildren: () => import('../employee-sales-details/employee-sales-details.module').then( m => m.EmployeeSalesDetailsPageModule),
      canActivate: [AuthService]
    },
  ]

}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContainerPageRoutingModule {}
