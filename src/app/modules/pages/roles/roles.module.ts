import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { RoleFormPage } from './role-form/role-form.page';
import { RoleListPage } from './role-list/role-list.page';

@NgModule({
    declarations: [
      RoleListPage,
      RoleFormPage
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule
    ],
    exports: [RoleListPage]
})
export class RolesPageModule {
}
