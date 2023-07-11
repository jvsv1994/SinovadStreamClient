import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { SearchViewWebPage } from './search-view-web.page';
import { VerticalItemListPageModule } from '../vertical-item-list/vertical-item-list.module';

@NgModule({
    declarations: [
      SearchViewWebPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        VerticalItemListPageModule
    ],
    exports: [SearchViewWebPage]
})
export class SearchViewWebPageModule {
}
