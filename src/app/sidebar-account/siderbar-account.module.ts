import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SidebarAccountPage } from './sidebar-account.page';
import { RouterModule } from '@angular/router';
import { DropDownMenuPageModule } from '../drop-down-menu/drop-down-menu.module';

@NgModule({
    declarations: [
        SidebarAccountPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        RouterModule,
        DropDownMenuPageModule
    ],
    exports: [SidebarAccountPage]
})
export class SidebarAccountPageModule {
}
