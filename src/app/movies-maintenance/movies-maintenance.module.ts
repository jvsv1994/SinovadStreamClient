import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { MoviesMaintenancePage } from './movies-maintenance.page';
import { ItemListPageModule } from '../item-list/item-list.module';


@NgModule({
    declarations: [
      MoviesMaintenancePage
    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      ItemListPageModule
    ],
    exports: [MoviesMaintenancePage]
})
export class MoviesMaintenancePageModule {
}
