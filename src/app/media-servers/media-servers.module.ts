import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MediaServerListModalPage } from './media-server-list-modal/media-server-list-modal.page';
import { MediaServerListPage } from './media-server-list/media-server-list.page';

@NgModule({
    declarations: [
      MediaServerListPage,
      MediaServerListModalPage
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule
    ],
    exports: [MediaServerListPage,MediaServerListModalPage]
})
export class MediaServersModule {
}
