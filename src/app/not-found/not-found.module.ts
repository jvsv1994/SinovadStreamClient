import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { NotFoundPage } from './not-found.page';

@NgModule({
    declarations: [
      NotFoundPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [NotFoundPage]
})
export class NotFoundPageModule {
}
