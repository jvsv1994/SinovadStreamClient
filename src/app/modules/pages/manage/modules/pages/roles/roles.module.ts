import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { RoleListComponent } from './components/role-list/role-list.component';
import { RoleFormComponent } from './components/role-form/role-form.component';
import { RolesRoutingModule } from './roles-routing.module';
import { RoleMenusComponent } from './components/role-menus/role-menus.component';

@NgModule({
    declarations: [
      RoleListComponent,
      RoleFormComponent,
      RoleMenusComponent
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      RolesRoutingModule,
      SharedModule
    ],
    exports: [RoleListComponent,RoleFormComponent,RoleMenusComponent]
})
export class RolesPageModule {
}
