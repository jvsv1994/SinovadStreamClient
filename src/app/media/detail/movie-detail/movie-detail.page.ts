
import { Component, OnInit} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { HttpClient} from '@angular/common/http';
import { HttpMethodType } from 'src/app/shared/enums';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { ActivatedRoute, Router } from '@angular/router';

import { SinovadApiGenericResponse } from 'src/app/response/sinovadApiGenericResponse';
import { ItemDetail } from '../../shared/item-detail.model';

declare var window;
@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.page.html',
  styleUrls: ['./movie-detail.page.scss']
})
export class MovieDetailPage implements OnInit {

  detail:ItemDetail;

  constructor(
    public activeRoute: ActivatedRoute,
    private router: Router,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedService: SharedService) {


    }

    ngOnInit(): void {
      let movieId=this.activeRoute.snapshot.params.movieId;
      if(movieId)
      {
        this.getMovieDetail(movieId);
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

}
