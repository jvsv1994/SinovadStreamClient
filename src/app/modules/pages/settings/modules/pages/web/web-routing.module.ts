import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loggedUserGuard } from 'src/app/guards/logged-user.guard';
import { LogPageComponent } from './components/log-page/log-page.component';

const routes: Routes = [
  {
    path: 'log',
    component: LogPageComponent,
    canActivate:[loggedUserGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebRoutingModule { }
