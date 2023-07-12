import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { HeaderDesktopPage } from './header-desktop.page';
import { DropDownUserPageModule } from '../dropdown-account/dropdown-account.module';
@NgModule({
    declarations: [
      HeaderDesktopPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        DropDownUserPageModule,
        ReactiveFormsModule
    ],
    exports: [HeaderDesktopPage]
})
export class HeaderDesktopPageModule {
}
