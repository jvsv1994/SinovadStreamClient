import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { ProfilesViewPageModule } from '../profiles-view/profiles-view.module';
import { SideBarWebAdminPage } from './sidebar-web-admin.page';

@NgModule({
    declarations: [
        SideBarWebAdminPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        ProfilesViewPageModule
    ],
    exports: [SideBarWebAdminPage]
})
export class SideBarWebAdminPageModule {
}
