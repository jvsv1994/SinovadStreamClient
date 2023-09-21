import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogListComponent } from './components/catalog-list/catalog-list.component';
import { loggedUserGuard } from 'src/app/guards/logged-user.guard';
import { adminGuard } from 'src/app/guards/admin.guard';
import { CatalogFormComponent } from './components/catalog-form/catalog-form.component';

const routes: Routes = [
  {
    path:"",
    component:CatalogListComponent,
    canActivate:[loggedUserGuard,adminGuard]
  },
  {
    path:"add",
    component:CatalogFormComponent,
    canActivate:[loggedUserGuard,adminGuard]
  },
  {
    path:"edit/:catalogId",
    component:CatalogFormComponent,
    canActivate:[loggedUserGuard,adminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogsRoutingModule { }
