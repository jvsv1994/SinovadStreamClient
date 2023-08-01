import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { RoleFormPage } from './role-form/role-form.page';
import { RoleListPage } from './role-list/role-list.page';
import { RolesComponent } from './roles.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CustomSpinnerPageModule } from '../custom-spinner/custom-spinner.module';

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
      MatPaginatorModule,
      CustomSpinnerPageModule
    ],
    exports: [RoleListPage]
})
export class RolesPageModule {
}
