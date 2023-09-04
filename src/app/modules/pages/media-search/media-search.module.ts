import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { SearchViewComponent } from './components/search-view/search-view.component';
import { VerticalItemListComponent } from './components/vertical-item-list/vertical-item-list.component';

@NgModule({
    declarations: [
      SearchViewComponent,VerticalItemListComponent
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      RouterModule
    ],
    exports: [SearchViewComponent,VerticalItemListComponent]
})
export class MediaSearchModule {
}
