
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { Router } from '@angular/router';

declare var window;
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss']
})
export class AccountPage extends ParentComponent implements OnInit {

  isCollapsedChangePasswordSection:boolean=true;
  constructor(
    private router: Router,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)
    }

    ngOnInit(): void {
      if(this.sharedData.apiToken==undefined)
      {
        this.router.navigateByUrl('/landing');
      }
    }


}
