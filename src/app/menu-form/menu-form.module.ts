import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ItemGenresPageModule } from '../item-genres/item-genres.module';
import { MenuFormPage } from './menu-form.page';

@NgModule({
    declarations: [
      MenuFormPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        ItemGenresPageModule
    ],
    exports: [MenuFormPage]
})
export class MenuFormPageModule {
}
