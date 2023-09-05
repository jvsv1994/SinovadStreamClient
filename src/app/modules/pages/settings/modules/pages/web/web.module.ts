import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebRoutingModule } from './web-routing.module';
import { LogPageComponent } from './components/log-page/log-page.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';


@NgModule({
  declarations: [LogPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    WebRoutingModule
  ],
  exports:[LogPageComponent]
})
export class WebModule { }
