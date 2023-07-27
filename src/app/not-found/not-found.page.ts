
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient } from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.page.html',
  styleUrls: ['./not-found.page.scss']
})
export class NotFoundPage extends ParentComponent implements OnInit {

  constructor(
    private router: Router,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)

    }

  ngOnInit(): void {
    this.sharedData.pageNotFoundShowing=true;
  }

  public goInitialPage(){
    var pagePath=this.sharedData.apiToken!=undefined?"/home":"/landing";
    this.router.navigateByUrl(pagePath).then((response) => {
      this.sharedData.pageNotFoundShowing=false;
    },error=>{
      console.error(error);
    });
  }


}
