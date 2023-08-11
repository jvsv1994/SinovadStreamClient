
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { ActivatedRoute } from '@angular/router';
import { MediaServer } from 'src/app/servers/shared/server.model';
import { Library } from 'src/app/libraries/shared/library.model';

export class MediaGeneric{

  mediaServer:MediaServer;
  library:Library;
  title:string;
  subtitle:string;

  constructor(public activeRoute: ActivatedRoute,public sharedService: SharedService) {}

  public initializeHeaderData(): void {
    var mediaServerGuid=this.activeRoute.snapshot.params.serverGuid;
    if(mediaServerGuid!=undefined)
    {
      var mediaServer=this.sharedService.mediaServers.find(x=>x.Guid==mediaServerGuid);
      if(mediaServer)
      {
        this.mediaServer=mediaServer;
        var libraryId=this.activeRoute.snapshot.params.libraryId;
        if(mediaServer.ListLibraries!=undefined && mediaServer.ListLibraries.length>0)
        {
          var library=mediaServer.ListLibraries.find(x=>x.MediaServerId==this.mediaServer.Id && x.Id==libraryId);
          if(library!=undefined)
          {
            this.library=library;
            this.title=library.Name;
            this.subtitle=this.mediaServer.FamilyName?this.mediaServer.FamilyName:this.mediaServer.DeviceName;
          }else{
            this.title=this.mediaServer.FamilyName?this.mediaServer.FamilyName:this.mediaServer.DeviceName;
          }
        }
      }
    }
  }

}
