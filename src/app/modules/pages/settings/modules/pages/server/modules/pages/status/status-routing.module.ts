import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertsComponent } from './modules/pages/alerts/components/alerts/alerts.component';
import { loggedUserGuard } from 'src/app/guards/logged-user.guard';

const routes: Routes = [ {
  path: 'alerts',
  component: AlertsComponent,
  loadChildren: () => import('./modules/pages/alerts/alerts.module').then(m => m.AlertsModule),
  canActivate:[loggedUserGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatusRoutingModule { }
