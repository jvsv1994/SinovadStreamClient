import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { SinovadWebAdminComponent } from './sinovad-web-admin.component';
import { RootWebAdminPageModule } from '../root-web-admin/root-web-admin.module';



@NgModule({
    declarations: [
      SinovadWebAdminComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        RootWebAdminPageModule
    ],
    exports: [SinovadWebAdminComponent]
})
export class SinovadWebAdminComponentModule {
}
