
import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { MediaType } from '../enums';

@Component({
  selector: 'app-tvseries-maintenance',
  templateUrl: './tvseries-maintenance.page.html',
  styleUrls: ['./tvseries-maintenance.page.scss']
})
export class TvSeriesMaintenancePage extends ParentComponent implements OnInit {

  currentMediaTypeID:number;
  title:string;

  constructor(
    public restProvider: RestProviderService,
    public  ref:ChangeDetectorRef,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

    public ngOnInit(): void {
      this.title="Series de Tv";
      this.currentMediaTypeID=MediaType.TvSerie;
    }

}
