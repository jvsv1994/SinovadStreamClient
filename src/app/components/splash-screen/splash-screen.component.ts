
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/services/shared-data.service';

declare var window;
@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent {

  constructor(
    public domSanitizer: DomSanitizer,
    public sharedDataService: SharedDataService) {


    }

}
