import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { MediaServerService } from 'src/app/servers/shared/server.service';
import { MediaService } from './media.service';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SignalIRHubService {

  private connectionCompleted$ = new Subject<boolean>();

  constructor(
    private mediaService:MediaService,
    private mediaServerService:MediaServerService,
    private sharedService:SharedService
    ) {

  }

  public completeConnection():void{
    this.connectionCompleted$.next(true);
  };

  public isCompletedConnection():Observable<boolean>{
    return this.connectionCompleted$.asObservable();
  }

  public openConnection():Promise<any>{
    let ctx=this;
    return new Promise((resolve, reject) => {
      var hubConnection = new HubConnectionBuilder().withUrl(this.sharedService.urlSinovadStreamWebApi+'/mediaServerHub', {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      }).build();
      hubConnection.start().then(() => {
        console.log('connection started');
        ctx.setEvents(hubConnection);
        ctx.sharedService.hubConnection=hubConnection;
        ctx.completeConnection();
        resolve(true);
      }).catch((err) => {
        console.error('error while establishing signalr connection: ' + err);
        reject(err);
      });
    });
  }

  public stopConnection(){
    this.sharedService.hubConnection.off('UpdateMediaServers');
    this.sharedService.hubConnection.off('EnableMediaServer');
    this.sharedService.hubConnection.off('DisableMediaServer');
    this.sharedService.hubConnection.off('UpdateLibrariesByMediaServer');
    this.sharedService.hubConnection.off('UpdateItemsByMediaServer');
    this.sharedService.hubConnection.off('UpdateItemsByMediaServerAndLibrary');
    this.sharedService.hubConnection.stop();
  }

  private setEvents(hubConnection:HubConnection){
      hubConnection.on('UpdateMediaServers', (message) => {
        this.mediaServerService.getMediaServers();
      });
      hubConnection.on('EnableMediaServer', (mediaServerGuid:string) => {
        var mediaServer=this.sharedService.mediaServers.find(x=>x.Guid==mediaServerGuid);
        if(!mediaServer.isSecureConnection)
        {
          mediaServer.isSecureConnection=true;
          this.mediaServerService.executeGetLibrariesByMediaServer(mediaServer);
        }
      });
      hubConnection.on('DisableMediaServer', (mediaServerGuid:string) => {
        var mediaServer=this.sharedService.mediaServers.find(x=>x.Guid==mediaServerGuid);
        if(mediaServer.isSecureConnection)
        {
          mediaServer.isSecureConnection=false;
          this.mediaServerService.executeGetLibrariesByMediaServer(mediaServer);
        }
      });
      hubConnection.on('UpdateLibrariesByMediaServer', (mediaServerGuid:string) => {
        var mediaServer=this.sharedService.mediaServers.find(x=>x.Guid==mediaServerGuid);
        if(mediaServer)
        {
          this.mediaServerService.executeGetLibrariesByMediaServer(mediaServer);
        }
      });
      hubConnection.on('UpdateItemsByMediaServer', (mediaServerGuid:string) => {
        this.mediaService.updateMediaItems();
      });
      hubConnection.on('UpdateItemsByMediaServerAndLibrary', (mediaServerGuid:string,libraryGuid:string) => {
        this.mediaService.updateMediaItems();
      });
      hubConnection.invoke("AddConnectionToUserClientsGroup",this.sharedService.userData.Guid).then(res=>{})
  }

}
