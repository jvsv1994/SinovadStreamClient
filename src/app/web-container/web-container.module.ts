import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { VideoPageModule } from '../video/video.module';
import { WebContainerPage } from './web-container.page';
import { HeaderPageModule } from '../header/header.module';
import { SidebarModule } from '../sidebar/sidebar.module';
@NgModule({
    declarations: [
      WebContainerPage
    ],
    imports: [
      CommonModule,
      FormsModule,
      VideoPageModule,
      HeaderPageModule,
      SidebarModule,
      ReactiveFormsModule,
      SharedModule,
      RouterModule.forChild([])
    ],
    exports: [WebContainerPage]
})
export class WebContainerPageModule {
}
