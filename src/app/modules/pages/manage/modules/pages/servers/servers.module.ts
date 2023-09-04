import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { MediaServerListComponent } from './components/server-list/media-server-list.component';
import { MediaServerListModalComponent } from './components/server-list-modal/media-server-list-modal.component';

@NgModule({
    declarations: [
      MediaServerListComponent,
      MediaServerListModalComponent
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule
    ],
    exports: [MediaServerListComponent,MediaServerListModalComponent]
})
export class MediaServersModule {
}
