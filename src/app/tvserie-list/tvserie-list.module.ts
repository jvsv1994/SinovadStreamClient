import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ItemListPageModule } from '../item-list/item-list.module';
import { TvSerieListPage } from './tvserie-list.page';


@NgModule({
    declarations: [
      TvSerieListPage
    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      ItemListPageModule
    ],
    exports: [TvSerieListPage]
})
export class TvSerieListPageModule {
}
