import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SidebarMediaPage } from './sidebar-media.page';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
      SidebarMediaPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        RouterModule
    ],
    exports: [SidebarMediaPage]
})
export class SidebarMediaPageModule {
}
