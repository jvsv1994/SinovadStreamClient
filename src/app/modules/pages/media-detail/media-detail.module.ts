import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MediaDetailComponent } from './components/media-detail.component';

@NgModule({
    declarations: [
      MediaDetailComponent
    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule
    ],
    exports: [MediaDetailComponent]
})
export class MediaDetailModule {
}
