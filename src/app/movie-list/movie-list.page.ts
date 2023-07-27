
import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { MediaType } from '../enums';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.page.html',
  styleUrls: ['./movie-list.page.scss']
})
export class MovieListPage extends ParentComponent implements OnInit {

  currentMediaTypeID:number;
  title:string;

  constructor(
    public restProvider: RestProviderService,
    public  ref:ChangeDetectorRef,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)

    }

    public ngOnInit(): void {
      this.title="Películas";
      this.currentMediaTypeID=MediaType.Movie;
    }

}
