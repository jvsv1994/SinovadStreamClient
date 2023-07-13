
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient } from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { ItemDetail } from '../models/itemDetail';
import { Router } from '@angular/router';

declare var window;
@Component({
  selector: 'app-search-view-web',
  templateUrl: './search-view-web.page.html',
  styleUrls: ['./search-view-web.page.scss']
})
export class SearchViewWebPage extends ParentComponent implements OnInit {

  @Output() executeSearch =new EventEmitter();
  searchText:string="";
  isFocusSearch:boolean=false;

  constructor(
    private router: Router,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

    public ngOnInit(): void {

    }

    public ngAfterViewInit(){
    }

    public onChangeSearchValue(){
      this.executeSearch.emit(this.searchText);
    }

    public clearSearchText(){
      this.searchText="";
      this.executeSearch.emit(this.searchText);
    }

    public onClickSearchButton(){

    }

    public onSelectItem(detail:ItemDetail){
      if(detail.Item.TvSerieId)
      {
        this.router.navigateByUrl("/"+this.sharedData.platform+"/tvseriedetail/"+detail.Item.TvSerieId);
      }else if(detail.Item.MovieId)
      {
        this.router.navigateByUrl("/"+this.sharedData.platform+"/moviedetail/"+detail.Item.MovieId);
      }
    }

}
