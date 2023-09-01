import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { SearchViewPage } from './components/search-view/search-view.page';
import { VerticalItemListPage } from './components/vertical-item-list/vertical-item-list.page';

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
export class MediaSearchModule {
}
