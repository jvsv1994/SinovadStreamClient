import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { SideBarTvPage } from './sidebar-tv.page';
import { ProfilesViewPageModule } from '../profiles-view/profiles-view.module';

@NgModule({
    declarations: [
        SideBarTvPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        ProfilesViewPageModule
    ],
    exports: [SideBarTvPage]
})
export class SideBarTvPageModule {
}
