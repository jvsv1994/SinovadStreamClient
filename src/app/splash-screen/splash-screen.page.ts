
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';

import { RestProviderService } from 'src/app/shared/services/rest-provider.service';

declare var window;
@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.page.html',
  styleUrls: ['./splash-screen.page.scss']
})
export class SplashScreenPage {

  constructor(
    public restProvider: RestProviderService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {


    }

}
