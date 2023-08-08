
import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { Router } from '@angular/router';
import { MediaType } from 'src/app/shared/enums';

import { ItemDetail } from '../shared/item-detail.model';

@Component({
  selector: 'app-media-tvseries',
  templateUrl: './media-tvseries.page.html',
  styleUrls: ['./media-tvseries.page.scss']
})
export class MediaTvSeriesPage implements OnInit {

  currentMediaTypeID:number;
  title:string;

  constructor(
    public restProvider: RestProviderService,
    private router: Router,
    public  ref:ChangeDetectorRef,
    public sharedService: SharedService) {


    }

    public ngOnInit(): void {
      this.title="Series";
      this.currentMediaTypeID=MediaType.TvSerie;
    }

}
