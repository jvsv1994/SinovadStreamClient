import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranscoderSettingssPage } from './transcode-settings.page';
import { SharedModule } from '../shared/shared.module';

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
export class TranscoderSettingssPageModule {
}
