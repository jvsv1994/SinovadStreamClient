
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
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.page.html',
  styleUrls: ['./movie-detail.page.scss']
})
export class MovieDetailPage extends ParentComponent implements OnInit {

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
      let movieId=this.activeRoute.snapshot.params.movieId;
      if(movieId)
      {
        this.getMovieDetail(movieId);
      }else{
        this.router.navigate([this.sharedData.platform,'404'],{ skipLocationChange: false});
      }
    }

    public getMovieDetail(movieId:number){
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,"/videos/GetMovieDataByAccount?accountId="+this.sharedData.accountData.Id+"&movieId="+movieId).then((response:SinovadApiGenericResponse) => {
        this.detail=response.Data;
      },error=>{
        console.error(error);
        this.router.navigate([this.sharedData.platform,'404'],{ skipLocationChange: false});
      });
    }

}
