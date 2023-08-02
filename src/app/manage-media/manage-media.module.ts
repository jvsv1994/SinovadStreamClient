import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageMediaPage } from './manage-media.page';
import { DirectoryChooserPageModule } from '../directory-chooser/directory-chooser.module';
import { SharedModule } from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StorageFormPageModule } from '../storage-form/storage-form.module';
import { CustomActionsMenuPageModule } from '../custom-actions-menu/custom-actions-menu.module';
import { ConfirmDeleteMessageBoxPageModule } from '../confirm-delete-message-box/confirm-delete-message-box.module';

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
        StorageFormPageModule,
        CustomActionsMenuPageModule,
        ConfirmDeleteMessageBoxPageModule
    ],
    exports: [ManageMediaPage]
})
export class ManageMediaPageModule {
}
