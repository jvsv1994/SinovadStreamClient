import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HorizontalItemListPage } from './horizontal-item-list/horizontal-item-list.page';
import { MediaServerComponent } from './media-server/media-server.component';


@NgModule({
    declarations: [
      MediaServerComponent,HorizontalItemListPage
    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule
    ],
    exports: [MediaServerComponent,HorizontalItemListPage]
})
export class MediaModule {
}
