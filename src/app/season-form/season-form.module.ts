import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { ItemGenresPageModule } from '../item-genres/item-genres.module';
import { SeasonFormPage } from './season-form.page';

@NgModule({
    declarations: [
      SeasonFormPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        ItemGenresPageModule
    ],
    exports: [SeasonFormPage]
})
export class SeasonFormPageModule {
}
