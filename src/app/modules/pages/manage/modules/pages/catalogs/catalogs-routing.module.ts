import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogListComponent } from './components/catalog-list/catalog-list.component';
import { mainAdminGuard } from 'src/app/guards/main-admin.guard';
import { CatalogFormComponent } from './components/catalog-form/catalog-form.component';
import { CatalogDetailListComponent } from './components/catalog-detail-list/catalog-detail-list.component';
import { CatalogDetailFormComponent } from './components/catalog-detail-form/catalog-detail-form.component';

const routes: Routes = [
  {
    path:"",
    component:CatalogListComponent,
    canActivate:[mainAdminGuard]
  },
  {
    path:"add",
    component:CatalogFormComponent,
    canActivate:[mainAdminGuard]
  },
  {
    path:"edit/:catalogId",
    component:CatalogFormComponent,
    canActivate:[mainAdminGuard]
  },
  {
    path:"details/:catalogId",
    component:CatalogDetailListComponent,
    canActivate:[mainAdminGuard]
  },
  {
    path:"details/:catalogId/add",
    component:CatalogDetailFormComponent,
    canActivate:[mainAdminGuard]
  },
  {
    path:"details/:catalogId/edit/:catalogDetailId",
    component:CatalogDetailFormComponent,
    canActivate:[mainAdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogsRoutingModule { }
