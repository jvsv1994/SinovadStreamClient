import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { SearchViewDesktopPage } from './search-view-desktop.page';
import { VerticalItemListPageModule } from '../vertical-item-list/vertical-item-list.module';

@NgModule({
    declarations: [
      SearchViewDesktopPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        VerticalItemListPageModule
    ],
    exports: [SearchViewDesktopPage]
})
export class SearchViewDesktopPageModule {
}
