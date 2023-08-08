
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemDetail } from '../../shared/item-detail.model';

declare var window;
@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.page.html',
  styleUrls: ['./search-view.page.scss']
})
export class SearchViewPage implements OnInit {

  @Output() executeSearch =new EventEmitter();
  @Output() showItemView =new EventEmitter();
  searchText:string="";

  constructor(
    private router: Router,
    private route:ActivatedRoute,
    public sharedService: SharedService) {
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
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
