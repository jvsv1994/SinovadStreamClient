import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MediaItemsComponent } from './components/media-items/media-items.component';


@NgModule({
    declarations: [
      MediaItemsComponent
    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule
    ],
    exports: [MediaItemsComponent]
})
export class MediaItemsModule {
}
