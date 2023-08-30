import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MediaDetailComponent } from './detail/media-detail.component';
import { MediaItemsComponent } from './items/media-items.component';


@NgModule({
    declarations: [
      MediaItemsComponent,MediaDetailComponent
    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule
    ],
    exports: [MediaItemsComponent,MediaDetailComponent]
})
export class MediaModule {
}
