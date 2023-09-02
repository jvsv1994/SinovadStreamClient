import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/modules/shared/services/shared-data.service';
import { Observable, Subject } from 'rxjs';

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
    private sharedService:SharedService
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
    var hubConnection = new HubConnectionBuilder().withUrl(this.sharedService.urlSinovadStreamWebApi+'/mediaServerHub', {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets
    }).build();
    this.sharedService.hubConnection=hubConnection;
    this.startHubConnection();
  }

  private startHubConnection(){
    let ctx=this;
    this.sharedService.hubConnection.start().then(() => {
      console.log('connection started');
      ctx.setEvents(ctx.sharedService.hubConnection);
    }).catch((err) => {
      console.error('error while establishing signalr connection: ' + err);
    });
    this.sharedService.hubConnection.onclose(x=>{
      setTimeout(() => {
        ctx.startHubConnection();
      }, 5000);
    });
  }

  public stopConnection(){
    this.sharedService.hubConnection.off('UpdateCurrentTimeMediaFilePlayBack');
    this.sharedService.hubConnection.off('AddMediaFilePlayBack');
    this.sharedService.hubConnection.off('RemovedMediaFilePlayBack');
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
        this.updateMediaServers();
      });
      hubConnection.on('EnableMediaServer', (mediaServerGuid:string) => {
        var mediaServer=this.sharedService.mediaServers.find(x=>x.Guid==mediaServerGuid);
        if(!mediaServer.isSecureConnection)
        {
          mediaServer.isSecureConnection=true;
        }
        this.enableMediaServer(mediaServerGuid);
      });
      hubConnection.on('DisableMediaServer', (mediaServerGuid:string) => {
        var mediaServer=this.sharedService.mediaServers.find(x=>x.Guid==mediaServerGuid);
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
      hubConnection.invoke("AddConnectionToUserClientsGroup",this.sharedService.userData.Guid).then(res=>{})
  }

  public isRemovedMediaFilePlayback():Observable<any>{
    return this.removedMediaFilePlayBack$.asObservable();
  }

  public isAddedMediaFilePlayback():Observable<any>{
    return this.addedMediaFilePlayBack$.asObservable();
  }

  public removeMediaFilePlayBack(mediaServerGuid:string,mediaFilePlaybackGuid:string){
    this.sharedService.hubConnection.send("RemoveMediaFilePlayBack",this.sharedService.userData.Guid,mediaServerGuid,mediaFilePlaybackGuid);
  }

  public removeLastTranscodedMediaFileProcess(mediaServerGuid:string,mediaFilePlaybackGuid:string){
    this.sharedService.hubConnection.send("RemoveLastTranscodedMediaFileProcess",this.sharedService.userData.Guid,mediaServerGuid,mediaFilePlaybackGuid);
  }

  public updateCurrentTimeMediaFilePlayBack(mediaServerGuid:string,mediaFilePlaybackGuid:string,currentTime:number,isPlaying:boolean){
    this.sharedService.hubConnection.send("UpdateCurrentTimeMediaFilePlayBack",this.sharedService.userData.Guid,mediaServerGuid,mediaFilePlaybackGuid,currentTime,isPlaying);
  }

  public isUpdatingCurrentTimeMediaFilePlayBack():Observable<any>{
    return this.updateCurrentTimeMediaFilePlayBack$.asObservable();
  }


}
