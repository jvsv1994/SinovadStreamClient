import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { HeaderWebPage } from './header-web.page';
import { DropDownAccountPageModule } from '../dropdown-account/dropdown-account.module';

@NgModule({
    declarations: [
      HeaderWebPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        DropDownAccountPageModule
    ],
    exports: [HeaderWebPage]
})
export class HeaderWebPageModule {
}
