import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { HeaderPage } from './header/header.page';
import { DropDownUserPage } from './dropdown-user/dropdown-user.page';

@NgModule({
    declarations: [
      HeaderPage,DropDownUserPage
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      RouterModule
    ],
    exports: [HeaderPage,DropDownUserPage]
})
export class NavbarModule {
}
