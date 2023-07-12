import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ManageMediaPage } from './manage-media.page';
import { DirectoryChooserPageModule } from '../directory-chooser/directory-chooser.module';
import { SharedModule } from 'src/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StorageFormPageModule } from '../account-storage-form/account-storage-form.module';

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
