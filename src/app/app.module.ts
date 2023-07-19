import { Injector, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { createCustomElement } from '@angular/elements';
import { ParentComponent } from './parent/parent.component';
import { BrowserModule} from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { SharedModule } from 'src/shared.module';
import { FormsModule } from '@angular/forms';
import { SinovadWebComponentModule } from './sinovad-web/sinovad-web.module';
import { SinovadWebComponent } from './sinovad-web/sinovad-web.component';
import { SinovadTvComponentModule } from './sinovad-tv/sinovad-tv.module';
import { SinovadTvComponent } from './sinovad-tv/sinovad-tv.component';

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
    SinovadTvComponentModule,
    AppRoutingModule,
  ],
  bootstrap:[]
})
export class AppModule {
  constructor(private injector: Injector) {}
  ngDoBootstrap() {
      const sinovadWebComponent = createCustomElement(SinovadWebComponent, { injector: this.injector });
      customElements.define('app-sinovad-web', sinovadWebComponent);
      const sinovadTvComponent = createCustomElement(SinovadTvComponent, { injector: this.injector });
      customElements.define('app-sinovad-tv', sinovadTvComponent);
  }

}
