import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { ItemGenresPageModule } from '../item-genres/item-genres.module';
import { EpisodeFormPage } from './episode-form.page';

@NgModule({
    declarations: [
      EpisodeFormPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        ItemGenresPageModule
    ],
    exports: [EpisodeFormPage]
})
export class EpisodeFormPageModule {
}
