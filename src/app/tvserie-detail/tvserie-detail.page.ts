
import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { HttpMethodType } from '../Enums';
import { RestProviderService } from 'src/services/rest-provider.service';
import { ItemDetail } from '../models/itemDetail';
import { ActivatedRoute, Router } from '@angular/router';
import { SinovadApiGenericResponse } from '../response/sinovadApiGenericResponse';

declare var window;
@Component({
  selector: 'app-tvserie-detail',
  templateUrl: './tvserie-detail.page.html',
  styleUrls: ['./tvserie-detail.page.scss']
})
export class TvSerieDetailPage extends ParentComponent implements OnInit {

  @Output() toggleVideo =new EventEmitter();
  detail:ItemDetail;

  constructor(
    public activeRoute: ActivatedRoute,
    private router: Router,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

    ngOnInit(): void {
      let tvSerieId=this.activeRoute.snapshot.params.tvSerieId;
      if(tvSerieId)
      {
        this.getTvSerieDetail(tvSerieId);
      }else{
        this.router.navigate([this.sharedData.platform,'404'],{ skipLocationChange: false});
      }
    }

    public getTvSerieDetail(tvSerieId:number){
      var path="/videos/GetTvSerieDataByUser?userId="+this.sharedData.userData.Id+"&tvSerieId="+tvSerieId;
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        if(response.Data.ListSeasons && response.Data.ListSeasons.length>0)
        {
          response.Data.CurrentSeason=response.Data.ListSeasons[0];
        }
        this.detail=response.Data;
      },error=>{
        console.error(error);
      });
    }

}
