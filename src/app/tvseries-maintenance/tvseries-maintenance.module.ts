import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { ItemListPageModule } from '../item-list/item-list.module';
import { TvSeriesMaintenancePage } from './tvseries-maintenance.page';


@NgModule({
    declarations: [
      TvSeriesMaintenancePage
    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      ItemListPageModule
    ],
    exports: [TvSeriesMaintenancePage]
})
export class TvSeriesMaintenancePageModule {
}
