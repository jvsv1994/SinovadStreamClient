import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebRoutingModule } from './web-routing.module';
import { LogPageComponent } from './components/log-page/log-page.component';


@NgModule({
  declarations: [LogPageComponent],
  imports: [
    CommonModule,
    WebRoutingModule
  ],
  exports:[LogPageComponent]
})
export class WebModule { }
