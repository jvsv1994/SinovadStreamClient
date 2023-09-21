import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogsRoutingModule } from './catalogs-routing.module';
import { CatalogListComponent } from './components/catalog-list/catalog-list.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { CatalogFormComponent } from './components/catalog-form/catalog-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CatalogListComponent,
    CatalogFormComponent
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
