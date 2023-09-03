
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/services/shared-data.service';

import { RestProviderService } from 'src/app/modules/shared/services/rest-provider.service';

declare var window;
@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent {

  constructor(
    public restProvider: RestProviderService,
    public domSanitizer: DomSanitizer,
    public sharedDataService: SharedDataService) {


    }

}
