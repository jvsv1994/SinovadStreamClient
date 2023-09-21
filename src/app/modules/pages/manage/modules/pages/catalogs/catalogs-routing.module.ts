import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogListComponent } from './components/catalog-list/catalog-list.component';
import { loggedUserGuard } from 'src/app/guards/logged-user.guard';
import { adminGuard } from 'src/app/guards/admin.guard';
import { CatalogFormComponent } from './components/catalog-form/catalog-form.component';
import { CatalogDetailListComponent } from './components/catalog-detail-list/catalog-detail-list.component';
import { CatalogDetailFormComponent } from './components/catalog-detail-form/catalog-detail-form.component';

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
  },
  {
    path:"details/:catalogId",
    component:CatalogDetailListComponent,
    canActivate:[loggedUserGuard,adminGuard]
  },
  {
    path:"details/:catalogId/add",
    component:CatalogDetailFormComponent,
    canActivate:[loggedUserGuard,adminGuard]
  },
  {
    path:"details/:catalogId/edit/:catalogDetailId",
    component:CatalogDetailFormComponent,
    canActivate:[loggedUserGuard,adminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogsRoutingModule { }
