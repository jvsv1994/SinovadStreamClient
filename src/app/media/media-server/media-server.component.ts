
import { Component, OnInit} from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaType } from 'src/app/shared/enums';
import { ItemDetail } from '../shared/item-detail.model';
import { MediaServerService } from 'src/app/servers/shared/server.service';
import { MediaServer } from 'src/app/servers/shared/server.model';
import { SinovadApiGenericResponse } from 'src/app/response/sinovadApiGenericResponse';
import { Library } from 'src/app/libraries/shared/library.model';

@Component({
  selector: 'app-media-server',
  templateUrl: './media-server.component.html',
  styleUrls: ['./media-server.component.scss']
})
export class MediaServerComponent implements OnInit {

  mediaServer:MediaServer;
  library:Library;
  currentMediaTypeID:number;
  title:string;

  constructor(
    private serverService: MediaServerService,
    public activeRoute: ActivatedRoute,
    private router: Router,
    public sharedService: SharedService) {
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
    }

    public ngOnInit(): void {
      var mediaServerGuid=this.activeRoute.snapshot.params.serverGuid;
      this.getMediaServerByGuid(mediaServerGuid);
      let libraryId = this.activeRoute.snapshot.queryParams['source'];

    }

    public getMediaServerByGuid(mediaServerGuid:string){
      this.serverService.getMediaServerByGuid(mediaServerGuid).then((response:SinovadApiGenericResponse) => {
        var mediaServer=response.Data;
        this.mediaServer=mediaServer;
        this.title=this.mediaServer.FamilyName?this.mediaServer.FamilyName:this.mediaServer.DeviceName;
        this.currentMediaTypeID=MediaType.Movie;
      },error=>{
        this.router.navigateByUrl('/404')
      });
    }

    public onSelectMovie(detail:ItemDetail){
      this.router.navigateByUrl('/moviedetail/'+detail.Item.MovieId);
    }

}
