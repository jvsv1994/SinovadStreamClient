import { NgModule } from '@angular/core';
import { ClickOutsideDirective } from 'src/app/shared/directives/click-outside-directive';
import { FormatDataPipe } from './pipes/format-data.pipe';
import { CustomConfirmDialogComponent } from './components/custom-confirm-dialog/custom-confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { CustomSpinnerPage } from './components/custom-spinner/custom-spinner.page';
import { AngularMaterialModule } from './angular-material.module';
import { CustomContextMenuComponent } from './components/custom-context-menu/custom-context-menu.component';
import { CustomDialogOptionsComponent } from './components/custom-dialog-options/custom-dialog-options.component';
@NgModule({
  imports: [
    CommonModule,AngularMaterialModule
  ],
  declarations: [
    FormatDataPipe,ClickOutsideDirective,CustomConfirmDialogComponent,CustomSpinnerPage,CustomContextMenuComponent,CustomDialogOptionsComponent
  ],
  providers: [
  ],
  exports: [
    FormatDataPipe,ClickOutsideDirective,CustomConfirmDialogComponent,CustomSpinnerPage,CustomContextMenuComponent,CommonModule,AngularMaterialModule,CustomDialogOptionsComponent
  ]
})
export class SharedModule { }
