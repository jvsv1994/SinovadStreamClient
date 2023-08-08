
import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { Router } from '@angular/router';
import { MediaType } from 'src/app/shared/enums';

import { ItemDetail } from '../shared/item-detail.model';

@Component({
  selector: 'app-media-movies',
  templateUrl: './media-movies.page.html',
  styleUrls: ['./media-movies.page.scss']
})
export class MediaMoviesPage implements OnInit {

  currentMediaTypeID:number;
  title:string;

  constructor(
    public restProvider: RestProviderService,
    private router: Router,
    public  ref:ChangeDetectorRef,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedService: SharedService) {


    }

    public ngOnInit(): void {
      this.title="Películas";
      this.currentMediaTypeID=MediaType.Movie;
    }

    public onSelectMovie(detail:ItemDetail){
      this.router.navigateByUrl('/moviedetail/'+detail.Item.MovieId);
    }

}
