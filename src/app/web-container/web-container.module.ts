import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { WebContainerPage } from './web-container.page';
import { SidebarModule } from '../sidebar/sidebar.module';
import { NavbarModule } from '../navbar/navbar.module';
import { VideoPageModule } from '../media/video/video.module';
@NgModule({
    declarations: [
      WebContainerPage
    ],
    imports: [
      CommonModule,
      FormsModule,
      SidebarModule,
      NavbarModule,
      ReactiveFormsModule,
      SharedModule,
      VideoPageModule,
      RouterModule.forChild([])
    ],
    exports: [WebContainerPage]
})
export class WebContainerPageModule {
}
