import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared.module';
import { VideoPageModule } from '../video/video.module';
import { SplashScreenPageModule } from '../splash-screen/splash-screen.module';
import { SidebarAccountPageModule } from '../sidebar-account/siderbar-account.module';
import { SidebarMediaPageModule } from '../sidebar-media/siderbar-media.module';
import { SidebarAdministratorPageModule } from '../sidebar-administrator/siderbar-administrator.module';
import { WebContainerPage } from './web-container.page';
import { HeaderPageModule } from '../header/header.module';
import { CustomToastPageModule } from '../custom-toast/custom-toast.module';
@NgModule({
    declarations: [
      WebContainerPage
    ],
    imports: [
      CommonModule,
      FormsModule,
      VideoPageModule,
      HeaderPageModule,
      SidebarAdministratorPageModule,
      SidebarAccountPageModule,
      SidebarMediaPageModule,
      ReactiveFormsModule,
      SharedModule,
      SplashScreenPageModule,
      CustomToastPageModule,
      RouterModule.forChild([])
    ],
    exports: [WebContainerPage]
})
export class WebContainerPageModule {
}
