import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemViewPage } from './item-view.page';
import { SharedModule } from 'src/shared.module';

@NgModule({
    declarations: [
        ItemViewPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [ItemViewPage]
})
export class ItemViewPageModule {
}
