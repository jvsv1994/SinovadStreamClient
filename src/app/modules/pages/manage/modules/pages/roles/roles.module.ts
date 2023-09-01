import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoleListPage } from './components/role-list/role-list.page';
import { RoleFormPage } from './components/role-form/role-form.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

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
