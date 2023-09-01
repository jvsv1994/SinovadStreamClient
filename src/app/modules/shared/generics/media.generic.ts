
import { SharedService } from 'src/app/modules/shared/services/shared-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Library } from '../../pages/settings/modules/pages/server/modules/pages/manage/modules/pages/libraries/models/library.model';
import { MediaServer } from '../../pages/manage/modules/pages/servers/models/server.model';

export class MediaGeneric{

  mediaServer:MediaServer;
  library:Library;
  title:string;
  subtitle:string;

  constructor(
    public router:Router,
    public activeRoute: ActivatedRoute,
    public sharedService: SharedService) {}

  public initializeHeaderData(): void {
    var mediaServerGuid=this.activeRoute.snapshot.params.serverGuid;
    if(mediaServerGuid!=undefined)
    {
      var mediaServer=this.sharedService.mediaServers.find(x=>x.Guid==mediaServerGuid);
      if(mediaServer)
      {
        this.mediaServer=JSON.parse(JSON.stringify(mediaServer));
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
