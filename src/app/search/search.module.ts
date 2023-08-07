import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { SearchViewPage } from './search-view/search-view.page';
import { VerticalItemListPage } from './vertical-item-list/vertical-item-list.page';

@NgModule({
    declarations: [
      SearchViewPage,VerticalItemListPage
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      RouterModule
    ],
    exports: [SearchViewPage,VerticalItemListPage]
})
export class SearchModule {
}
