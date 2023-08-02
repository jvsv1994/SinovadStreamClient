import { NgModule } from '@angular/core';
import { ClickOutsideDirective } from 'src/app/shared/directives/click-outside-directive';
import { FormatDataPipe } from './pipes/format-data.pipe';
import { CustomConfirmDialogComponent } from './components/custom-confirm-dialog/custom-confirm-dialog.component';

@NgModule({
  imports: [
  ],
  declarations: [
    FormatDataPipe,ClickOutsideDirective,CustomConfirmDialogComponent
  ],
  providers: [
  ],
  exports: [
    FormatDataPipe,ClickOutsideDirective,CustomConfirmDialogComponent
  ]
})
export class SharedModule { }
