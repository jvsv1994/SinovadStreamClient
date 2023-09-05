import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loggedUserGuard } from 'src/app/guards/logged-user.guard';
import { MyAccountPageComponent } from './modules/pages/account-settings/components/my-account/my-account-page.component';

const routes: Routes = [
  {
    path: 'account',
    component: MyAccountPageComponent,
    loadChildren: () => import('./modules/pages/account-settings/account-settings.module').then(m => m.AccountSettingsModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'server/:serverGuid',
    loadChildren: () => import('./modules/pages/server/server.module').then(m => m.ServerModule)
  },
  {
    path: 'web',
    loadChildren: () => import('./modules/pages/web/web.module').then(m => m.WebModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
