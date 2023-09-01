import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { TranscoderSettingssPage } from './components/transcode-settings/transcode-settings.page';

@NgModule({
    declarations: [
      TranscoderSettingssPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [TranscoderSettingssPage]
})
export class TranscodeModule {
}
