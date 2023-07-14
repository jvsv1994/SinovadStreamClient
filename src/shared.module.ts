import { NgModule } from '@angular/core';
import { FormatDataPipe } from './pipes/format-data.pipe';
import { ClickOutsideDirective } from './directives/click-outside-directive';

@NgModule({
  imports: [
  ],
  declarations: [
    FormatDataPipe,ClickOutsideDirective
  ],
  providers: [
  ],
  exports: [
    FormatDataPipe,ClickOutsideDirective
  ]
})
export class SharedModule { }
