import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { PaginationPageModule } from '../pagination/pagination.module';
import { ContextMenuPageModule } from '../context-menu/context-menu.module';
import { RoleFormPage } from './role-form/role-form.page';
import { RoleListPage } from './role-list/role-list.page';
import { RolesComponent } from './roles.component';

@NgModule({
    declarations: [
      RolesComponent,
      RoleListPage,
      RoleFormPage
    ],
    providers:[],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      PaginationPageModule,
      ContextMenuPageModule
    ],
    exports: [RoleListPage]
})
export class RolesPageModule {
}
