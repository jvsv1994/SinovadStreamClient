import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { ItemGenresPage } from './item-genres.page';

@NgModule({
    declarations: [
      ItemGenresPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [ItemGenresPage]
})
export class ItemGenresPageModule {
}
