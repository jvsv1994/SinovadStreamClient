import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranscoderSettingssPage } from './transcode-settings.page';
import { DirectoryChooserPageModule } from '../directory-chooser/directory-chooser.module';
import { SharedModule } from '../shared/shared.module';
import { SuccessMessageModalPageModule } from '../success-message-modal/success-message-modal.module';

@NgModule({
    declarations: [
      TranscoderSettingssPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        DirectoryChooserPageModule,
        SuccessMessageModalPageModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [TranscoderSettingssPage]
})
export class TranscoderSettingssPageModule {
}
