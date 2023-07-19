
import { Component, OnInit} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';

@Component({
  selector: 'app-search-view-root',
  templateUrl: './search-view-root.page.html',
  styleUrls: ['./search-view-root.page.scss']
})
export class SearchViewRootPage extends ParentComponent implements OnInit {


  constructor(
    public restProvider: RestProviderService,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

    ngOnInit(): void {

    }

    ngAfterViewInit(){

    }

}
