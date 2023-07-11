import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { ItemGenresPageModule } from '../item-genres/item-genres.module';
import { ConfirmMessageModalPage } from './confirm-message-modal.page';
@NgModule({
    declarations: [
      ConfirmMessageModalPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        ItemGenresPageModule
    ],
    exports: [ConfirmMessageModalPage]
})
export class ConfirmMessageModalPageModule {
}
