import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loggedUserGuard } from 'src/app/guards/logged-user.guard';
import { MyAccountPage } from './modules/pages/account-settings/components/my-account/my-account.page';

const routes: Routes = [
  {
    path: 'account',
    component: MyAccountPage,
    loadChildren: () => import('./modules/pages/account-settings/account-settings.module').then(m => m.AccountSettingsModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'server/:serverGuid',
    loadChildren: () => import('./modules/pages/server/server.module').then(m => m.ServerModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
