import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../../../../../../../../shared/shared.module';
import { ServerSettingsGeneralPageComponent } from './components/server-settings-general/server-settings-general.page.component';

@NgModule({
    declarations: [
      ServerSettingsGeneralPageComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [ServerSettingsGeneralPageComponent]
})
export class GeneralModule {
}
