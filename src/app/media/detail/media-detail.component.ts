
import { Component, OnInit} from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { HttpMethodType, MediaType } from 'src/app/shared/enums';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { ActivatedRoute, Router } from '@angular/router';

import { SinovadApiGenericResponse } from 'src/app/response/sinovadApiGenericResponse';
import { ItemDetail } from '../shared/item-detail.model';

declare var window;
@Component({
  selector: 'app-media-detail',
  templateUrl: './media-detail.component.html',
  styleUrls: ['./media-detail.component.scss']
})
export class MediaDetailComponent implements OnInit {

  detail:ItemDetail;

  constructor(
    public activeRoute: ActivatedRoute,
    private router: Router,
    public restProvider: RestProviderService,
    public sharedService: SharedService) {


    }

    ngOnInit(): void {
      let mediaType = this.activeRoute.snapshot.queryParams['mediaType'];
      let mediaId = this.activeRoute.snapshot.queryParams['mediaId'];
      if(mediaType && mediaId)
      {
        if(mediaType==MediaType.Movie)
        {
          this.getMovieDetail(mediaId);
        }else if(mediaType==MediaType.TvSerie)
        {
          this.getTvSerieDetail(mediaId);
        }else{
          this.router.navigate(['404'],{ skipLocationChange: false});
        }
      }else{
        this.router.navigate(['404'],{ skipLocationChange: false});
      }
    }

    public getMovieDetail(movieId:number){
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,"/videos/GetMovieDataByUser?userId="+this.sharedService.userData.Id+"&movieId="+movieId).then((response:SinovadApiGenericResponse) => {
        this.detail=response.Data;
      },error=>{
        console.error(error);
        this.router.navigate(['404'],{ skipLocationChange: false});
      });
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
