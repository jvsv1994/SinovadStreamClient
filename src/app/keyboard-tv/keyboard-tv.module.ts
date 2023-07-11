import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VideoPageModule } from '../video/video.module';
import { SharedModule } from 'src/shared.module';
import { KeyboardTvPage } from './keyboard-tv.page';

@NgModule({
    declarations: [
        KeyboardTvPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        VideoPageModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [KeyboardTvPage]
})
export class KeyboardTvPageModule {
}
