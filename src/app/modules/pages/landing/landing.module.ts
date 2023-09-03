import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { LandingComponent } from './components/landing/landing.component';
@NgModule({
    declarations: [
      LandingComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [LandingComponent]
})
export class LandingPageModule {
}
