import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ServerSettingsGeneralPage } from './server-settings-general.page';

@NgModule({
    declarations: [
      ServerSettingsGeneralPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [ServerSettingsGeneralPage]
})
export class ServerSettingsGeneralPageModule {
}
