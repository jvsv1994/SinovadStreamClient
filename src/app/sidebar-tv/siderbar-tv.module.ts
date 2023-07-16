import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { SideBarTvPage } from './sidebar-tv.page';
import { ProfilesViewTvPageModule } from '../profiles-view-tv/profiles-view-tv.module';

@NgModule({
    declarations: [
        SideBarTvPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        ProfilesViewTvPageModule
    ],
    exports: [SideBarTvPage]
})
export class SideBarTvPageModule {
}
