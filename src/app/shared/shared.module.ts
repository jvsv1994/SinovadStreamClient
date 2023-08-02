import { NgModule } from '@angular/core';
import { ClickOutsideDirective } from 'src/app/shared/directives/click-outside-directive';
import { FormatDataPipe } from './pipes/format-data.pipe';
import { CustomConfirmDialogComponent } from './components/custom-confirm-dialog/custom-confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { CustomToastPage } from './components/custom-toast/custom-toast.page';
import { CustomSpinnerPage } from './components/custom-spinner/custom-spinner.page';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    FormatDataPipe,ClickOutsideDirective,CustomConfirmDialogComponent,CustomToastPage,CustomSpinnerPage
  ],
  providers: [
  ],
  exports: [
    FormatDataPipe,ClickOutsideDirective,CustomConfirmDialogComponent,CustomToastPage,CustomSpinnerPage
  ]
})
export class SharedModule { }
