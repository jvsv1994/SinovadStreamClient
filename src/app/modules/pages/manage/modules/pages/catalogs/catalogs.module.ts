import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogsRoutingModule } from './catalogs-routing.module';
import { CatalogListComponent } from './components/catalog-list/catalog-list.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';


@NgModule({
  declarations: [
    CatalogListComponent
  ],
  imports: [
    CommonModule,
    CatalogsRoutingModule,
    SharedModule
  ]
})
export class CatalogsModule { }
