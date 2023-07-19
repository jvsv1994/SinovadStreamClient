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
      ReactiveFormsModule,
      SharedModule,
      SplashScreenPageModule,
      RouterModule.forChild([])
    ],
    exports: [RootWebAdminPage]
})
export class RootWebAdminPageModule {
}
