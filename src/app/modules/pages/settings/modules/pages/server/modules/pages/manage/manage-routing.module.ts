import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibraryListComponent } from './modules/pages/libraries/components/library-list/library-list.component';
import { loggedUserGuard } from 'src/app/guards/logged-user.guard';

const routes: Routes = [  {
  path: 'libraries',
  component: LibraryListComponent,
  loadChildren: () => import('./modules/pages/libraries/libraries.module').then(m => m.LibrariesModule),
  canActivate:[loggedUserGuard]
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }
