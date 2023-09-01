import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loggedUserGuard } from 'src/app/guards/logged-user.guard';
import { ServerSettingsGeneralPage } from './modules/pages/general/components/server-settings-general/server-settings-general.page';
import { TranscoderSettingssPage } from './modules/pages/transcode/components/transcode-settings/transcode-settings.page';

const routes: Routes = [
  {
    path: 'general',
    component: ServerSettingsGeneralPage,
    loadChildren: () => import('./modules/pages/general/general.module').then(m => m.GeneralModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'transcode',
    component: TranscoderSettingssPage,
    loadChildren: () => import('./modules/pages/transcode/transcode.module').then(m => m.TranscodeModule),
    canActivate:[loggedUserGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
