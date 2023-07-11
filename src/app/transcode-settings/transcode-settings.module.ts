import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranscodeSettingsPage } from './transcode-settings.page';
import { DirectoryChooserPageModule } from '../directory-chooser/directory-chooser.module';
import { SharedModule } from 'src/shared.module';
import { SuccessMessageModalPageModule } from '../success-message-modal/success-message-modal.module';

@NgModule({
    declarations: [
      TranscodeSettingsPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        DirectoryChooserPageModule,
        SuccessMessageModalPageModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [TranscodeSettingsPage]
})
export class TranscodeSettingsPageModule {
}
