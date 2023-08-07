
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { HttpClient } from '@angular/common/http';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ParentComponent } from 'src/app/parent/parent.component';
import { ItemDetail } from '../../shared/item-detail.model';

declare var window;
@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.page.html',
  styleUrls: ['./search-view.page.scss']
})
export class SearchViewPage extends ParentComponent implements OnInit {

  @Output() executeSearch =new EventEmitter();
  @Output() showItemView =new EventEmitter();
  searchText:string="";

  constructor(
    private router: Router,
    private route:ActivatedRoute,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)

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
