import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { HeaderWebPage } from './header-web.page';
import { DropDownUserPageModule } from '../dropdown-user/dropdown-user.module';

@NgModule({
    declarations: [
      HeaderWebPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        DropDownUserPageModule
    ],
    exports: [HeaderWebPage]
})
export class HeaderWebPageModule {
}
