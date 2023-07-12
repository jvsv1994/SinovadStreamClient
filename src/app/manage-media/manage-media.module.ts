import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageMediaPage } from './manage-media.page';
import { DirectoryChooserPageModule } from '../directory-chooser/directory-chooser.module';
import { SharedModule } from 'src/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StorageFormPageModule } from '../storage-form/storage-form.module';

@NgModule({
    declarations: [
        ManageMediaPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        DirectoryChooserPageModule,
        SharedModule,
        ReactiveFormsModule,
        NgbModule,
        StorageFormPageModule
    ],
    exports: [ManageMediaPage]
})
export class ManageMediaPageModule {
}
