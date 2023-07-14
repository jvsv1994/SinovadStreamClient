import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { ContextMenuPage } from './context-menu.page';

@NgModule({
    declarations: [
        ContextMenuPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [ContextMenuPage]
})
export class ContextMenuPageModule {
}
