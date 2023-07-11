import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectoryChooserPage } from './directory-chooser.page';
import { SharedModule } from 'src/shared.module';

@NgModule({
    declarations: [
        DirectoryChooserPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [DirectoryChooserPage]
})
export class DirectoryChooserPageModule {
}
