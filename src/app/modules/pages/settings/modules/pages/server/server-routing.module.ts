import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'status',
    loadChildren: () => import('./modules/pages/status/status.module').then(m => m.StatusModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./modules/pages/settings/settings.module').then(m => m.SettingsModule)
  },
  {
    path: 'manage',
    loadChildren: () => import('./modules/pages/manage/manage.module').then(m => m.ManageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServerRoutingModule { }
