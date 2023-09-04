import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { TranscoderSettingssPageComponent } from './components/transcode-settings/transcode-settings-page.component';

@NgModule({
    declarations: [
      TranscoderSettingssPageComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [TranscoderSettingssPageComponent]
})
export class TranscodeModule {
}
