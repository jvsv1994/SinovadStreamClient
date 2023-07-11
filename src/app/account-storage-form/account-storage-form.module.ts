import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectoryChooserPageModule } from '../directory-chooser/directory-chooser.module';
import { SharedModule } from 'src/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountStorageFormPage } from './account-storage-form.page';

@NgModule({
    declarations: [
        AccountStorageFormPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        DirectoryChooserPageModule,
        SharedModule,
        ReactiveFormsModule,
        NgbModule
    ],
    exports: [AccountStorageFormPage]
})
export class AccountStorageFormPageModule {
}
