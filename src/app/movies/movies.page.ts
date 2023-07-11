
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemType } from '../Enums';
import { ItemDetail } from '../models/itemDetail';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss']
})
export class MoviesPage extends ParentComponent implements OnInit {

  @Output() toggleVideo =new EventEmitter();
  currentItemTypeID:number;
  title:string;

  constructor(
    public restProvider: RestProviderService,
    private route:ActivatedRoute,
    private router: Router,
    public  ref:ChangeDetectorRef,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

    public ngOnInit(): void {
      this.title="Películas";
      this.currentItemTypeID=ItemType.Movie;
    }

    public onSelectMovie(detail:ItemDetail){
      this.router.navigate([this.sharedData.platform,'/moviedetail/'+detail.Item.MovieId],{ skipLocationChange: false});
    }

}
