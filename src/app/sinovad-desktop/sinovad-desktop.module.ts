import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { SinovadDesktopComponent } from './sinovad-desktop.component';
import { RootDesktopPageModule } from '../root-desktop/root-desktop.module';



@NgModule({
    declarations: [
      SinovadDesktopComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        RootDesktopPageModule
    ],
    exports: [SinovadDesktopComponent]
})
export class SinovadDesktopComponentModule {
}
