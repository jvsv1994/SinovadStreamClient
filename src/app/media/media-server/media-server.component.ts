
import { Component, OnInit} from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaServer } from 'src/app/servers/shared/server.model';
import { Library } from 'src/app/libraries/shared/library.model';
import { MediaType } from 'src/app/shared/enums';

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
  subtitle:string;

  constructor(
    public activeRoute: ActivatedRoute,
    private router: Router,
    public sharedService: SharedService) {
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
    }

    public ngOnInit(): void {
      var mediaServerGuid=this.activeRoute.snapshot.params.serverGuid;
      if(mediaServerGuid!=undefined)
      {
        var mediaServer=this.sharedService.mediaServers.find(x=>x.Guid==mediaServerGuid);
        if(mediaServer)
        {
          this.mediaServer=mediaServer;
          var libraryId=this.activeRoute.snapshot.params.libraryId;
          var library=this.sharedService.libraries.find(x=>x.MediaServerId==this.mediaServer.Id && x.Id==libraryId);
          if(library!=undefined)
          {
            this.library=library;
            this.title=library.Name;
            this.subtitle=this.mediaServer.FamilyName?this.mediaServer.FamilyName:this.mediaServer.DeviceName;
            this.currentMediaTypeID=library.MediaTypeCatalogDetailId;
          }else{
            this.title=this.mediaServer.FamilyName?this.mediaServer.FamilyName:this.mediaServer.DeviceName;
          }
        }
      }else{
         if(window.location.pathname.endsWith("movies"))
        {
          this.title="Películas";
          this.currentMediaTypeID=MediaType.Movie;
        }else if(window.location.pathname.endsWith("tvseries")){
          this.title="Series de Tv"
          this.currentMediaTypeID=MediaType.TvSerie;
        }
      }
    }

}
