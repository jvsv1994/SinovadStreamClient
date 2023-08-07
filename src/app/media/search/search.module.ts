import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SearchViewPage } from './search-view/search-view.page';
import { VerticalItemListPage } from './vertical-item-list/vertical-item-list.page';
import { SharedModule } from 'src/app/shared/shared.module';

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
