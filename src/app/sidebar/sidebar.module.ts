import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SidebarAccountPage } from './sidebar-account/sidebar-account.page';
import { SidebarAdministratorPage } from './sidebar-administrator/sidebar-administrator.page';
import { SidebarMediaPage } from './sidebar-media/sidebar-media.page';
import { RouterModule } from '@angular/router';
import { DropDownMenuContentPage } from './drop-down-menu/drop-down-menu-content.page';

@NgModule({
    declarations: [
      SidebarAccountPage,
      SidebarAdministratorPage,
      SidebarMediaPage,
      DropDownMenuContentPage
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      RouterModule
    ],
    exports: [SidebarAccountPage,SidebarAdministratorPage,SidebarMediaPage,DropDownMenuContentPage]
})
export class SidebarModule {
}
