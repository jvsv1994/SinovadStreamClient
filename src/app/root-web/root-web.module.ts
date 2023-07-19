import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { VideoPageModule } from '../video/video.module';
import { SideBarTvPageModule } from '../sidebar-tv/siderbar-tv.module';
import { SplashScreenPageModule } from '../splash-screen/splash-screen.module';
import { HeaderWebPageModule } from '../header-web/header-web.module';
import { RootWebPage } from './root-web.page';
import { RouterModule } from '@angular/router';
@NgModule({
    declarations: [
      RootWebPage
    ],
    imports: [
      CommonModule,
      FormsModule,
      VideoPageModule,
      HeaderWebPageModule,
      ReactiveFormsModule,
      SharedModule,
      SideBarTvPageModule,
      SplashScreenPageModule,
      RouterModule.forChild([])
    ],
    exports: [RootWebPage]
})
export class RootWebPageModule {
}
