import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VideoPage } from './video.page';
import { SharedModule } from 'src/shared.module';
import { ConfirmMessageModalPageModule } from '../confirm-message-modal/confirm-message-modal.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ConfirmMessageModalPageModule
  ],
  declarations: [VideoPage],
  exports: [VideoPage]
})
export class VideoPageModule {}
