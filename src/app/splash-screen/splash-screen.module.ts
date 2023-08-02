import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SplashScreenPage } from './splash-screen.page';

@NgModule({
    declarations: [
      SplashScreenPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ],
    exports: [SplashScreenPage]
})
export class SplashScreenPageModule {
}
