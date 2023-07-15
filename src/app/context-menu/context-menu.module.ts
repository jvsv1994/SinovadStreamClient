import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuPage } from './context-menu.page';
import { ContextMenuContentPage } from './context-menu-content.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';

@NgModule({
    providers:[],
    declarations: [ContextMenuPage,ContextMenuContentPage],
    imports: [
      CommonModule,
      FormsModule,
      SharedModule,
      ReactiveFormsModule
    ],
    exports: [ContextMenuPage,ContextMenuContentPage]
})
export class ContextMenuPageModule {
}
