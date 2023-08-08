
import { Component, OnInit} from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { Router } from '@angular/router';
import { ItemDetail } from '../shared/item-detail.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {

  itemViewData:ItemDetail;
  currentMediaTypeID:number;
  title:string;

  constructor(
    private router: Router,
    public sharedService: SharedService) {
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
    }

    public ngOnInit(): void {
      if(!localStorage.getItem('apiToken'))
      {
        this.router.navigate(['landing'],{ skipLocationChange: false});
      }
      this.itemViewData=undefined;
      this.currentMediaTypeID=undefined;
    }

    public onSelectItem(detail:ItemDetail){
      if(detail.Item.TvSerieId)
      {
        this.router.navigateByUrl('/tvseriedetail/'+detail.Item.TvSerieId);
      }else if(detail.Item.MovieId)
      {
        this.router.navigateByUrl('/moviedetail/'+detail.Item.MovieId);
      }
    }
}
