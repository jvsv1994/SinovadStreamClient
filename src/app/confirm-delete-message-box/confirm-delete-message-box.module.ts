import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ItemGenresPageModule } from '../item-genres/item-genres.module';
import { ConfirmDeleteMessageBoxPage } from './confirm-delete-message-box.page';
@NgModule({
    declarations: [
      ConfirmDeleteMessageBoxPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        ItemGenresPageModule
    ],
    exports: [ConfirmDeleteMessageBoxPage]
})
export class ConfirmDeleteMessageBoxPageModule {
}
