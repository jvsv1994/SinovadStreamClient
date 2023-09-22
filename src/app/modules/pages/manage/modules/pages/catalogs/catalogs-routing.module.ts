import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogListComponent } from './components/catalog-list/catalog-list.component';
import { loggedUserGuard } from 'src/app/guards/logged-user.guard';
import { mainAdminGuard } from 'src/app/guards/main-admin.guard';
import { CatalogFormComponent } from './components/catalog-form/catalog-form.component';
import { CatalogDetailListComponent } from './components/catalog-detail-list/catalog-detail-list.component';
import { CatalogDetailFormComponent } from './components/catalog-detail-form/catalog-detail-form.component';

const routes: Routes = [
  {
    path:"",
    component:CatalogListComponent,
    canActivate:[loggedUserGuard,mainAdminGuard]
  },
  {
    path:"add",
    component:CatalogFormComponent,
    canActivate:[loggedUserGuard,mainAdminGuard]
  },
  {
    path:"edit/:catalogId",
    component:CatalogFormComponent,
    canActivate:[loggedUserGuard,mainAdminGuard]
  },
  {
    path:"details/:catalogId",
    component:CatalogDetailListComponent,
    canActivate:[loggedUserGuard,mainAdminGuard]
  },
  {
    path:"details/:catalogId/add",
    component:CatalogDetailFormComponent,
    canActivate:[loggedUserGuard,mainAdminGuard]
  },
  {
    path:"details/:catalogId/edit/:catalogDetailId",
    component:CatalogDetailFormComponent,
    canActivate:[loggedUserGuard,mainAdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogsRoutingModule { }
