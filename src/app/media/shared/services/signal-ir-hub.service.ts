import { HttpTransportType, HubConnectionBuilder } from '@microsoft/signalr';
import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { MediaServerService } from 'src/app/servers/shared/server.service';
import { MediaService } from './media.service';

@Injectable({ providedIn: 'root' })
export class SignalIRHubService {

  constructor(
    private mediaService:MediaService,
    private mediaServerService:MediaServerService,
    private sharedService:SharedService
    ) {

  }

  public openSignalIRHubConnection():Promise<any>{
    let ctx=this;
    return new Promise((resolve, reject) => {
      var hubConnection = new HubConnectionBuilder().withUrl(this.sharedService.urlSinovadStreamWebApi+'/mediaServerHub', {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      }).build();
      hubConnection.start().then(() => {
        console.log('connection started');
        ctx.sharedService.hubConnection=hubConnection;
        ctx.setSignalIREvents();
        resolve(true);
      }).catch((err) => {
        console.error('error while establishing signalr connection: ' + err);
        reject(err);
      });
    });
  }

  private setSignalIREvents(){
      this.sharedService.hubConnection.on('UpdateMediaServers', (message) => {
        this.mediaServerService.getMediaServers();
      });
      this.sharedService.hubConnection.on('EnableMediaServer', (mediaServerGuid:string) => {
        var mediaServer=this.sharedService.mediaServers.find(x=>x.Guid==mediaServerGuid);
        if(!mediaServer.isSecureConnection)
        {
          mediaServer.isSecureConnection=true;
          this.mediaServerService.executeGetLibrariesByMediaServer(mediaServer);
        }
      });
      this.sharedService.hubConnection.on('DisableMediaServer', (mediaServerGuid:string) => {
        var mediaServer=this.sharedService.mediaServers.find(x=>x.Guid==mediaServerGuid);
        if(mediaServer.isSecureConnection)
        {
          mediaServer.isSecureConnection=false;
          this.mediaServerService.executeGetLibrariesByMediaServer(mediaServer);
        }
      });
      this.sharedService.hubConnection.on('UpdateLibrariesByMediaServer', (mediaServerGuid:string) => {
        var mediaServer=this.sharedService.mediaServers.find(x=>x.Guid==mediaServerGuid);
        if(mediaServer)
        {
          this.mediaServerService.executeGetLibrariesByMediaServer(mediaServer);
        }
      });
      this.sharedService.hubConnection.on('UpdateItemsByMediaServer', (mediaServerGuid:string) => {
        this.mediaService.updateMediaItems();
      });
      this.sharedService.hubConnection.on('UpdateItemsByMediaServerAndLibrary', (mediaServerGuid:string,libraryGuid:string) => {
        this.mediaService.updateMediaItems();
      });
      this.sharedService.hubConnection.invoke("AddConnectionToUserClientsGroup",this.sharedService.userData.Guid).then(res=>{})
  }

}
