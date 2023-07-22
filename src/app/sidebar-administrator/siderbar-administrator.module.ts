import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { ProfilesViewPageModule } from '../profiles-view/profiles-view.module';
import { SidebarAdministratorPage } from './sidebar-administrator.page';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
      SidebarAdministratorPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        ProfilesViewPageModule,
        RouterModule
    ],
    exports: [SidebarAdministratorPage]
})
export class SidebarAdministratorPageModule {
}
