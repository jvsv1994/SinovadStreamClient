import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { HorizontalItemListPageModule } from '../horizontal-item-list/horizontal-item-list.module';
import { TvSeriesPage } from './tvseries.page';


@NgModule({
    declarations: [
      TvSeriesPage
    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      HorizontalItemListPageModule
    ],
    exports: [TvSeriesPage]
})
export class TvSeriesPageModule {
}
