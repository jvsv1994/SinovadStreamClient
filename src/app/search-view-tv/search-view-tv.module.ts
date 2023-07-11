import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { SearchViewTvPage } from './search-view-tv.page';
import { VerticalItemListPageModule } from '../vertical-item-list/vertical-item-list.module';
import { KeyboardTvPageModule } from '../keyboard-tv/keyboard-tv.module';

@NgModule({
    declarations: [
      SearchViewTvPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        VerticalItemListPageModule,
        KeyboardTvPageModule
    ],
    exports: [SearchViewTvPage]
})
export class SearchViewTvPageModule {
}
