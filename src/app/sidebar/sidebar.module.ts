import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SidebarAccountPage } from './sidebar-account/sidebar-account.page';
import { SidebarAdministratorPage } from './sidebar-administrator/sidebar-administrator.page';
import { SidebarMediaPage } from './sidebar-media/sidebar-media.page';
import { RouterModule } from '@angular/router';
import { DropDownMenuPageModule } from '../drop-down-menu/drop-down-menu.module';

@NgModule({
    declarations: [
      SidebarAccountPage,
      SidebarAdministratorPage,
      SidebarMediaPage
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      RouterModule,
      DropDownMenuPageModule
    ],
    exports: [SidebarAccountPage,SidebarAdministratorPage,SidebarMediaPage]
})
export class SidebarModule {
}
