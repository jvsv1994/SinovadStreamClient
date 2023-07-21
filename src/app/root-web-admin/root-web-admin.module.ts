import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared.module';
import { VideoPageModule } from '../video/video.module';
import { SplashScreenPageModule } from '../splash-screen/splash-screen.module';
import { HeaderWebAdminPageModule } from '../header-web-admin/header-web-admin.module';
import { SideBarWebAdminPageModule } from '../sidebar-web-admin/siderbar-web-admin.module';
import { RootWebAdminPage } from './root-web-admin.page';
import { SidebarAccountPageModule } from '../sidebar-account/siderbar-account.module';
import { SidebarMediaPageModule } from '../sidebar-media/siderbar-media.module';
@NgModule({
    declarations: [
      RootWebAdminPage
    ],
    imports: [
      CommonModule,
      FormsModule,
      VideoPageModule,
      HeaderWebAdminPageModule,
      SideBarWebAdminPageModule,
      SidebarAccountPageModule,
      SidebarMediaPageModule,
      ReactiveFormsModule,
      SharedModule,
      SplashScreenPageModule,
      RouterModule.forChild([])
    ],
    exports: [RootWebAdminPage]
})
export class RootWebAdminPageModule {
}
