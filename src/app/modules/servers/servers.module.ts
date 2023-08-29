import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MediaServerListPage } from './server-list/media-server-list.page';
import { MediaServerListModalPage } from './server-list-modal/media-server-list-modal.page';

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
