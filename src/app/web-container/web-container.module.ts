import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { VideoPageModule } from '../video/video.module';
import { WebContainerPage } from './web-container.page';
import { SidebarModule } from '../sidebar/sidebar.module';
import { NavbarModule } from '../navbar/navbar.module';
@NgModule({
    declarations: [
      WebContainerPage
    ],
    imports: [
      CommonModule,
      FormsModule,
      VideoPageModule,
      SidebarModule,
      NavbarModule,
      ReactiveFormsModule,
      SharedModule,
      RouterModule.forChild([])
    ],
    exports: [WebContainerPage]
})
export class WebContainerPageModule {
}
