import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { SearchViewRootPage } from './search-view-root.page';
import { SearchViewWebAdminPageModule } from '../search-view-web-admin/search-view-web-admin.module';

@NgModule({
    declarations: [
      SearchViewRootPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        SearchViewWebAdminPageModule
    ],
    exports: [SearchViewRootPage]
})
export class SearchViewRootPageModule {
}
