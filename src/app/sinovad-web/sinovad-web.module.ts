import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { SinovadWebComponent } from './sinovad-web.component';
import { RootWebPageModule } from '../root-web/root-web.module';

@NgModule({
    declarations: [
      SinovadWebComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        RootWebPageModule
    ],
    exports: [SinovadWebComponent]
})
export class SinovadWebComponentModule {
}
