import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MediaServerListPage } from './server-list/media-server-list.page';
import { MediaServerListModalPage } from './server-list-modal/media-server-list-modal.page';
import { SharedModule } from '../../shared/shared.module';

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
