import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RoleFormPage } from './role-form/role-form.page';
import { RoleListPage } from './role-list/role-list.page';
import { RolesComponent } from './roles.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSortModule} from '@angular/material/sort';
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
      MatTableModule,
      MatInputModule,
      MatFormFieldModule,
      MatSortModule
    ],
    exports: [RoleListPage]
})
export class RolesPageModule {
}
