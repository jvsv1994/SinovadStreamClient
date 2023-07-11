
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient } from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';

declare var window;
@Component({
  selector: 'app-search-view-tv',
  templateUrl: './search-view-tv.page.html',
  styleUrls: ['./search-view-tv.page.scss']
})
export class SearchViewTvPage extends ParentComponent implements OnInit {

  @Output() showItemView =new EventEmitter();
  @Output() executeSearch =new EventEmitter();

  constructor(
    public restProvider: RestProviderService,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

    public ngAfterViewInit(){

    }

    public onExecuteSearchFromKeyboard(searchText:string){
      this.executeSearch.emit(searchText);
    }

}
