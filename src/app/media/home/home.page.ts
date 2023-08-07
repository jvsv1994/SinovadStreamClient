
import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ParentComponent } from '../../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { Router } from '@angular/router';
import { ItemDetail } from '../shared/item-detail.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage extends ParentComponent implements OnInit {

  itemViewData:ItemDetail;
  currentMediaTypeID:number;
  title:string;

  constructor(
    public restProvider: RestProviderService,
    private router: Router,
    public  ref:ChangeDetectorRef,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)

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