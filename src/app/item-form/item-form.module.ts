import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { ItemFormPage } from './item-form.page';
import { ItemGenresPageModule } from '../item-genres/item-genres.module';
import { CustomToastPageModule } from '../custom-toast/custom-toast.module';

@NgModule({
    declarations: [
      ItemFormPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        ItemGenresPageModule,
        CustomToastPageModule
    ],
    exports: [ItemFormPage]
})
export class ItemFormPageModule {
}
