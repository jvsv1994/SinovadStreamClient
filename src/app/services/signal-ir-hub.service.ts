import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Injectable({ providedIn: 'root' })
export class SignalIRHubService {

  private addedMediaFilePlayBack$ = new Subject<any>();
  private removedMediaFilePlayBack$ = new Subject<any>();
  private updateCurrentTimeMediaFilePlayBack$ = new Subject<any>();
  private updateMediaServers$ = new Subject<boolean>();
  private enableMediaServerSubject$ = new Subject<string>();
  private disableMediaServerSubject$ = new Subject<string>();
  private updateLibrariesByMediaServerSubject$ = new Subject<string>();
  private updateItemsByMediaServerSubject$ = new Subject<string>();
  //private updateItemsByMediaServerAndLibrarySubject$ = new Subject<string>();

  constructor(
    private sharedDataService:SharedDataService
    ) {

  }

  public updateMediaServers():void{
    this.updateMediaServers$.next(true);
  };

  public isUpdatingMediaServers():Observable<boolean>{
    return this.updateMediaServers$.asObservable();
  }

  public enableMediaServer(mediaServerGuid:string):void{
    this.enableMediaServerSubject$.next(mediaServerGuid);
  };

  public isEnablingMediaServer():Observable<string>{
    return this.enableMediaServerSubject$.asObservable();
  }

  public disableMediaServer(mediaServerGuid:string):void{
    this.disableMediaServerSubject$.next(mediaServerGuid);
  };

  public isDisablingMediaServer():Observable<string>{
    return this.disableMediaServerSubject$.asObservable();
  }

  public updateLibrariesByMediaServer(mediaServerGuid:string):void{
    this.updateLibrariesByMediaServerSubject$.next(mediaServerGuid);
  };

  public isUpdatingLibrariesByMediaServer():Observable<string>{
    return this.updateLibrariesByMediaServerSubject$.asObservable();
  }

  public updateItemsByMediaServer(mediaServerGuid:string):void{
    this.updateItemsByMediaServerSubject$.next(mediaServerGuid);
  };

  public isUpdatingItemsByMediaServer():Observable<string>{
    return this.updateItemsByMediaServerSubject$.asObservable();
  }


  public openConnection(){
    var hubConnection = new HubConnectionBuilder().withUrl(this.sharedDataService.urlSinovadStreamWebApi+'/mediaServerHub', {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets
    }).build();
    this.sharedDataService.hubConnection=hubConnection;
    this.tryStartHubConnection();
  }

  private tryStartHubConnection(){
    let ctx=this;
    this.sharedDataService.hubConnection.start().then(() => {
      console.log('connection started');
      ctx.setEvents(this.sharedDataService.hubConnection);
      ctx.sharedDataService.hubConnection.onclose(x=>{
        setTimeout(() => {
          if(ctx.sharedDataService.userData)
          {
            ctx.tryStartHubConnection();
          }
        }, 1000,ctx);
      });
    }).catch((err) => {
      console.error('error while establishing signalr connection: ' + err);
      setTimeout(() => {
        ctx.tryStartHubConnection();
      }, 1000,ctx);
    });
  }

  public stopConnection(){
    this.sharedDataService.hubConnection.off('UpdateCurrentTimeMediaFilePlayBack');
    this.sharedDataService.hubConnection.off('AddedMediaFilePlayBack');
    this.sharedDataService.hubConnection.off('RemovedMediaFilePlayBack');
    this.sharedDataService.hubConnection.off('UpdateMediaServers');
    this.sharedDataService.hubConnection.off('EnableMediaServer');
    this.sharedDataService.hubConnection.off('DisableMediaServer');
    this.sharedDataService.hubConnection.off('UpdateLibrariesByMediaServer');
    this.sharedDataService.hubConnection.off('UpdateItemsByMediaServer');
    this.sharedDataService.hubConnection.off('UpdateItemsByMediaServerAndLibrary');
    this.sharedDataService.hubConnection.stop();
  }

  private setEvents(hubConnection:HubConnection){
      hubConnection.on('UpdateMediaServers', (message) => {
        this.updateMediaServers();
      });
      hubConnection.on('EnableMediaServer', (mediaServerGuid:string) => {
        var mediaServer=this.sharedDataService.mediaServers.find(x=>x.Guid==mediaServerGuid);
        if(!mediaServer.isSecureConnection)
        {
          mediaServer.isSecureConnection=true;
        }
        this.enableMediaServer(mediaServerGuid);
      });
      hubConnection.on('DisableMediaServer', (mediaServerGuid:string) => {
        var mediaServer=this.sharedDataService.mediaServers.find(x=>x.Guid==mediaServerGuid);
        if(mediaServer.isSecureConnection)
        {
          mediaServer.isSecureConnection=false;
        }
        this.disableMediaServer(mediaServerGuid);
      });
      hubConnection.on('UpdateLibrariesByMediaServer', (mediaServerGuid:string) => {
        this.updateLibrariesByMediaServer(mediaServerGuid);
      });
      hubConnection.on('UpdateItemsByMediaServer', (mediaServerGuid:string) => {
        this.updateItemsByMediaServer(mediaServerGuid);
      });
/*       hubConnection.on('UpdateItemsByMediaServerAndLibrary', (mediaServerGuid:string,libraryGuid:string) => {
      }); */
      hubConnection.on('UpdateCurrentTimeMediaFilePlayBack', (mediaServerGuid:string,mediaFilePlaybackGuid:string,currentTime:number,isPlaying:boolean) => {
        this.updateCurrentTimeMediaFilePlayBack$.next({mediaServerGuid:mediaServerGuid,mediaFilePlaybackGuid:mediaFilePlaybackGuid,currentTime:currentTime,isPlaying:isPlaying});
      });
      hubConnection.on('AddedMediaFilePlayBack', (mediaServerGuid:string,mediaFilePlaybackGuid:string) => {
        this.addedMediaFilePlayBack$.next({mediaServerGuid:mediaServerGuid,mediaFilePlaybackGuid:mediaFilePlaybackGuid});
      });
      hubConnection.on('RemovedMediaFilePlayBack', (mediaServerGuid:string,mediaFilePlaybackGuid:string) => {
        this.removedMediaFilePlayBack$.next({mediaServerGuid:mediaServerGuid,mediaFilePlaybackGuid:mediaFilePlaybackGuid});
      });
      hubConnection.invoke("AddConnectionToUserClientsGroup",this.sharedDataService.userData.Guid).then(res=>{})
  }

  public isRemovedMediaFilePlayback():Observable<any>{
    return this.removedMediaFilePlayBack$.asObservable();
  }

  public isAddedMediaFilePlayback():Observable<any>{
    return this.addedMediaFilePlayBack$.asObservable();
  }

  public removeMediaFilePlayBack(mediaServerGuid:string,mediaFilePlaybackGuid:string){
    let ctx=this;
    this.sharedDataService.hubConnection.send("RemoveMediaFilePlayBack",this.sharedDataService.userData.Guid,mediaServerGuid,mediaFilePlaybackGuid).then(res=>{},(error)=>{
      setTimeout(() => {
        ctx.removeMediaFilePlayBack(mediaServerGuid,mediaFilePlaybackGuid);
      }, 1000,ctx);
    });
  }

  public removeLastTranscodedMediaFileProcess(mediaServerGuid:string,mediaFilePlaybackGuid:string){
    let ctx=this;
    this.sharedDataService.hubConnection.send("RemoveLastTranscodedMediaFileProcess",this.sharedDataService.userData.Guid,mediaServerGuid,mediaFilePlaybackGuid).then(res=>{},(error)=>{
      setTimeout(() => {
        ctx.removeLastTranscodedMediaFileProcess(mediaServerGuid,mediaFilePlaybackGuid);
      }, 1000,ctx);
    });
  }

  public updateCurrentTimeMediaFilePlayBack(mediaServerGuid:string,mediaFilePlaybackGuid:string,currentTime:number,isPlaying:boolean){
    this.sharedDataService.hubConnection.send("UpdateCurrentTimeMediaFilePlayBack",this.sharedDataService.userData.Guid,mediaServerGuid,mediaFilePlaybackGuid,currentTime,isPlaying);
  }

  public isUpdatingCurrentTimeMediaFilePlayBack():Observable<any>{
    return this.updateCurrentTimeMediaFilePlayBack$.asObservable();
  }


}
