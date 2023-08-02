import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SearchViewWebAdminPage } from './search-view-web-admin.page';
import { VerticalItemListPageModule } from '../vertical-item-list/vertical-item-list.module';

@NgModule({
    declarations: [
      SearchViewWebAdminPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        VerticalItemListPageModule
    ],
    exports: [SearchViewWebAdminPage]
})
export class SearchViewWebAdminPageModule {
}
