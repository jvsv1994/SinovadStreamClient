
import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { Router } from '@angular/router';
import { MediaType } from 'src/app/shared/enums';
import { ParentComponent } from 'src/app/parent/parent.component';
import { ItemDetail } from '../shared/item-detail.model';

@Component({
  selector: 'app-media-server',
  templateUrl: './media-server.component.html',
  styleUrls: ['./media-server.component.scss']
})
export class MediaServerComponent implements OnInit {

  currentMediaTypeID:number;
  title:string;

  constructor(
    private router: Router,
    public sharedData: SharedDataService) {
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
    }

    public ngOnInit(): void {
      this.title="Películas";
      this.currentMediaTypeID=MediaType.Movie;
    }

    public onSelectMovie(detail:ItemDetail){
      this.router.navigateByUrl('/moviedetail/'+detail.Item.MovieId);
    }

}
