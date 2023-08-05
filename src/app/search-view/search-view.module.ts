import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { VerticalItemListPageModule } from '../vertical-item-list/vertical-item-list.module';
import { SearchViewPage } from './search-view.page';

@NgModule({
    declarations: [
      SearchViewPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        VerticalItemListPageModule
    ],
    exports: [SearchViewPage]
})
export class SearchViewPageModule {
}
