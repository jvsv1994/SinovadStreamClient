
import { Component, OnInit} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';

@Component({
  selector: 'app-search-view-root',
  templateUrl: './search-view-root.page.html',
  styleUrls: ['./search-view-root.page.scss']
})
export class SearchViewRootPage extends ParentComponent implements OnInit {


  constructor(
    public restProvider: RestProviderService,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)

    }

    ngOnInit(): void {

    }

    ngAfterViewInit(){

    }

}
