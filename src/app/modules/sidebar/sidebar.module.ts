import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SidebarAccountPage } from './sidebar-account/sidebar-account.page';
import { SidebarAdministratorPage } from './sidebar-administrator/sidebar-administrator.page';
import { SidebarMediaPage } from './sidebar-media/sidebar-media.page';
import { RouterModule } from '@angular/router';
import { DropDownServersComponent } from './drop-down-servers/drop-down-servers.component';

@NgModule({
    declarations: [
      SidebarAccountPage,
      SidebarAdministratorPage,
      SidebarMediaPage,
      DropDownServersComponent
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      RouterModule
    ],
    exports: [SidebarAccountPage,SidebarAdministratorPage,SidebarMediaPage,DropDownServersComponent]
})
export class SidebarModule {
}
