import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoAuthService } from './services/no-auth/no-auth.service';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [NoAuthService]

  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'con',
    loadChildren: () => import('./container/container.module').then( m => m.ContainerPageModule)
  },
  {
    path: 'edit-bill',
    loadChildren: () => import('./edit-bill/edit-bill.module').then( m => m.EditBillPageModule)
  },
  {
    path: 'closing-balance',
    loadChildren: () => import('./closing-balance/closing-balance.module').then( m => m.ClosingBalancePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
