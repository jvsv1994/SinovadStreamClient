import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { ProfilesViewPageModule } from '../profiles-view/profiles-view.module';
import { SideBarDesktopPage } from './sidebar-desktop.page';

@NgModule({
    declarations: [
        SideBarDesktopPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        ProfilesViewPageModule
    ],
    exports: [SideBarDesktopPage]
})
export class SideBarDesktopPageModule {
}
