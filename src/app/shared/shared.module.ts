import { NgModule } from '@angular/core';
import { ClickOutsideDirective } from 'src/app/shared/directives/click-outside-directive';
import { FormatDataPipe } from './pipes/format-data.pipe';
import { CustomConfirmDialogComponent } from './components/custom-confirm-dialog/custom-confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { CustomSpinnerPage } from './components/custom-spinner/custom-spinner.page';
import { AngularMaterialModule } from './angular-material.module';
import { CustomContextMenuComponent } from './components/custom-context-menu/custom-context-menu.component';
@NgModule({
  imports: [
    CommonModule,AngularMaterialModule
  ],
  declarations: [
    FormatDataPipe,ClickOutsideDirective,CustomConfirmDialogComponent,CustomSpinnerPage,CustomContextMenuComponent
  ],
  providers: [
  ],
  exports: [
    FormatDataPipe,ClickOutsideDirective,CustomConfirmDialogComponent,CustomSpinnerPage,CustomContextMenuComponent,CommonModule,AngularMaterialModule
  ]
})
export class SharedModule { }
