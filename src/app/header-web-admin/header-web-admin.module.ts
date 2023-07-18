import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { HeaderWebAdminPage } from './header-web-admin.page';
import { DropDownUserPageModule } from '../dropdown-user/dropdown-user.module';
@NgModule({
    declarations: [
      HeaderWebAdminPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        DropDownUserPageModule,
        ReactiveFormsModule
    ],
    exports: [HeaderWebAdminPage]
})
export class HeaderWebAdminPageModule {
}
