
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { Router } from '@angular/router';
import { MediaType } from 'src/app/shared/enums';
import { ItemDetail } from '../../models/itemDetail';

@Component({
  selector: 'app-tvseries',
  templateUrl: './tvseries.page.html',
  styleUrls: ['./tvseries.page.scss']
})
export class TvSeriesPage extends ParentComponent implements OnInit {

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
      this.title="Series";
      this.currentMediaTypeID=MediaType.TvSerie;
    }

    public onSelectTvSerie(detail:ItemDetail){
      this.router.navigateByUrl('/tvseriedetail/'+detail.Item.TvSerieId);
    }
}
