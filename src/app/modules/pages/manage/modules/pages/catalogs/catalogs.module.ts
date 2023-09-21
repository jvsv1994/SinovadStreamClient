import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogsRoutingModule } from './catalogs-routing.module';
import { CatalogListComponent } from './components/catalog-list/catalog-list.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { CatalogFormComponent } from './components/catalog-form/catalog-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CatalogDetailListComponent } from './components/catalog-detail-list/catalog-detail-list.component';
import { CatalogDetailFormComponent } from './components/catalog-detail-form/catalog-detail-form.component';

@NgModule({
  declarations: [
    CatalogListComponent,
    CatalogFormComponent,
    CatalogDetailListComponent,
    CatalogDetailFormComponent
  ],
  imports: [
    CommonModule,
    CatalogsRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports:[CatalogListComponent,CatalogFormComponent]
})
export class CatalogsModule { }
