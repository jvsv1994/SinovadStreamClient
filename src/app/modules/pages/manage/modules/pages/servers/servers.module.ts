import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MediaServerListPage } from './components/server-list/media-server-list.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { MediaServerListModalPage } from './components/server-list-modal/media-server-list-modal.page';

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
