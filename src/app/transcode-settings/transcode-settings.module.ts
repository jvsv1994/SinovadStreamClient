import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranscoderSettingssPage } from './transcode-settings.page';
import { DirectoryChooserPageModule } from '../directory-chooser/directory-chooser.module';
import { SharedModule } from 'src/shared.module';
import { SuccessMessageModalPageModule } from '../success-message-modal/success-message-modal.module';
import { CustomToastPageModule } from '../custom-toast/custom-toast.module';

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
        ReactiveFormsModule,
        CustomToastPageModule
    ],
    exports: [TranscoderSettingssPage]
})
export class TranscoderSettingssPageModule {
}
