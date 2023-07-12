import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectoryChooserPageModule } from '../directory-chooser/directory-chooser.module';
import { SharedModule } from 'src/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StorageFormPage } from './storage-form.page';

@NgModule({
    declarations: [
        StorageFormPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        DirectoryChooserPageModule,
        SharedModule,
        ReactiveFormsModule,
        NgbModule
    ],
    exports: [StorageFormPage]
})
export class StorageFormPageModule {
}
