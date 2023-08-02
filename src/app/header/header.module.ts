import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { DropDownUserPageModule } from '../dropdown-user/dropdown-user.module';
import { RouterModule } from '@angular/router';
import { HeaderPage } from './header.page';
@NgModule({
    declarations: [
      HeaderPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        DropDownUserPageModule,
        ReactiveFormsModule,
        RouterModule
    ],
    exports: [HeaderPage]
})
export class HeaderPageModule {
}
