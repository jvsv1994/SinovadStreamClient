import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ItemFormPage } from './item-form.page';
import { ItemGenresPageModule } from '../item-genres/item-genres.module';

@NgModule({
    declarations: [
      ItemFormPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        ItemGenresPageModule
    ],
    exports: [ItemFormPage]
})
export class ItemFormPageModule {
}
