
import { Component, OnInit} from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { HttpMethodType } from 'src/app/shared/enums';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { ActivatedRoute, Router } from '@angular/router';

import { SinovadApiGenericResponse } from 'src/app/response/sinovadApiGenericResponse';
import { ItemDetail } from '../../shared/item-detail.model';

declare var window;
@Component({
  selector: 'app-tvserie-detail',
  templateUrl: './tvserie-detail.page.html',
  styleUrls: ['./tvserie-detail.page.scss']
})
export class TvSerieDetailPage implements OnInit {

  detail:ItemDetail;

  constructor(
    public activeRoute: ActivatedRoute,
    private router: Router,
    public restProvider: RestProviderService,
    public sharedService: SharedService) {


    }

    ngOnInit(): void {
      let tvSerieId=this.activeRoute.snapshot.params.tvSerieId;
      if(tvSerieId)
      {
        this.getTvSerieDetail(tvSerieId);
      }else{
        this.router.navigate(['404'],{ skipLocationChange: false});
      }
    }

    public getTvSerieDetail(tvSerieId:number){
      var path="/videos/GetTvSerieDataByUser?userId="+this.sharedService.userData.Id+"&tvSerieId="+tvSerieId;
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
