
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient } from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemDetail } from '../../models/itemDetail';

declare var window;
@Component({
  selector: 'app-search-view-web-admin',
  templateUrl: './search-view-web-admin.page.html',
  styleUrls: ['./search-view-web-admin.page.scss']
})
export class SearchViewWebAdminPage extends ParentComponent implements OnInit {

  @Output() executeSearch =new EventEmitter();
  @Output() showItemView =new EventEmitter();
  searchText:string="";

  constructor(
    private router: Router,
    private route:ActivatedRoute,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

    public ngOnInit(): void {
      let searchText = this.route.snapshot.queryParams['text'];
      if(searchText!=undefined && searchText!='')
      {
        this.searchText=searchText;
      }else{
        this.router.navigate(['home'],{ skipLocationChange: false});
      }
    }

    public ngAfterViewInit(){
      this.executeSearch.emit(this.searchText);
    }

    public onSelectItem(detail:ItemDetail){
      if(detail.Item.TvSerieId)
      {
        this.router.navigateByUrl("/tvseriedetail/"+detail.Item.TvSerieId);
      }else if(detail.Item.MovieId)
      {
        this.router.navigateByUrl("/moviedetail/"+detail.Item.MovieId);
      }
    }

}
