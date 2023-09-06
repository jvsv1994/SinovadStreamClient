import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogListComponent } from './components/catalog-list/catalog-list.component';
import { loggedUserGuard } from 'src/app/guards/logged-user.guard';
import { adminGuard } from 'src/app/guards/admin.guard';

const routes: Routes = [
  {
    path:"",
    component:CatalogListComponent,
    canActivate:[loggedUserGuard,adminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogsRoutingModule { }
