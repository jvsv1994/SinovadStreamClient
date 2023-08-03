import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ParentComponent } from './parent/parent.component';
import { BrowserModule} from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SinovadWebComponentModule } from './sinovad-web/sinovad-web.module';
import { SinovadWebComponent } from './sinovad-web/sinovad-web.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    ParentComponent
  ],
  providers: [{provide: APP_BASE_HREF, useValue : '/' }],
  imports: [
    BrowserModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    SinovadWebComponentModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  bootstrap:[SinovadWebComponent]
})
export class AppModule {}


