import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { DropDownMenuPage } from './drop-down-menu.page';
import { DropDownMenuContentPage } from './drop-down-menu-content.page';

@NgModule({
    providers:[],
    declarations: [DropDownMenuPage,DropDownMenuContentPage],
    imports: [
      CommonModule,
      FormsModule,
      SharedModule,
      ReactiveFormsModule
    ],
    exports: [DropDownMenuPage,DropDownMenuContentPage]
})
export class DropDownMenuPageModule {
}
