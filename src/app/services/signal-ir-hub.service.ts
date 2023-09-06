import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { Log } from '../modules/pages/settings/modules/pages/web/models/log.model';
import * as signalR from '@microsoft/signalr';

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
  private webLogs$ = new Subject<Log[]>();

  constructor(
    private sharedDataService:SharedDataService
    ) {

  }

  public addWebLog(webLog:Log){
    this.sharedDataService.webLogs.push(webLog);
    this.webLogs$.next(this.sharedDataService.webLogs);
  }

  public isUpdatingWebLogs():Observable<Log[]>{
    return this.webLogs$.asObservable();
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
    this.addWebLog({Created: new Date(),Description:"Definiendo conexión a Signal IR"})
    var hubConnection = new HubConnectionBuilder().withUrl(this.sharedDataService.urlSinovadStreamWebApi+'/mediaServerHub', {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets
    }).configureLogging(signalR.LogLevel.None).withAutomaticReconnect([1000,2000,4000,8000,16000,32000,64000,128000]).build();
    this.sharedDataService.hubConnection=hubConnection;
    let ctx=this;
    this.sharedDataService.hubConnection.onclose((error:Error)=>{
      ctx.addWebLog({Created: new Date(),Description:"Se cerró la conexión a Signal IR "+error.message})
    });
    this.sharedDataService.hubConnection.onreconnecting(x=>{
      ctx.addWebLog({Created: new Date(),Description:"Reconectando a Signal IR"})
    });
    this.sharedDataService.hubConnection.onreconnected((connectionId:string)=>{
      ctx.addWebLog({Created: new Date(),Description:"Reconexión satisfactoria a Signal IR"});
      ctx.removeHubHandlerMethods();
      setTimeout(() => {
        ctx.sharedDataService.hubConnection.invoke("AddConnectionToUserClientsGroup",this.sharedDataService.userData.Guid).then(res=>{})
        ctx.addHubEvents();
      }, 100,ctx);
    });
    this.tryStartHubConnection();
  }

  private tryStartHubConnection(){
    let ctx=this;
    this.addWebLog({Created: new Date(),Description:"Intentando conectarse a Signal IR"});
    this.sharedDataService.hubConnection.start().then(() => {
      ctx.addWebLog({Created: new Date(),Description:"Se inicio satisfactoriamente la conexión a Signal IR"})
      ctx.removeHubHandlerMethods();
      setTimeout(() => {
        ctx.sharedDataService.hubConnection.invoke("AddConnectionToUserClientsGroup",ctx.sharedDataService.userData.Guid).then(res=>{})
        ctx.addHubEvents();
      }, 100,ctx);
    }).catch((err) => {
      ctx.addWebLog({Created: new Date(),Description:"Error al iniciar la conexión a Signal IR"})
 /*      setTimeout(() => {
        ctx.tryStartHubConnection();
      }, 1000,ctx); */
    });
  }

  public stopConnection(){
    this.removeHubHandlerMethods();
    this.sharedDataService.hubConnection.stop();
  }

  public delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  private removeHubHandlerMethods(){
    this.addWebLog({Created: new Date(),Description:"Eliminando controladores para los metodos del hub"});
    this.sharedDataService.hubConnection.off('UpdateCurrentTimeMediaFilePlayBack');
    this.sharedDataService.hubConnection.off('AddedMediaFilePlayBack');
    this.sharedDataService.hubConnection.off('RemovedMediaFilePlayBack');
    this.sharedDataService.hubConnection.off('UpdateMediaServers');
    this.sharedDataService.hubConnection.off('EnableMediaServer');
    this.sharedDataService.hubConnection.off('DisableMediaServer');
    this.sharedDataService.hubConnection.off('UpdateLibrariesByMediaServer');
    this.sharedDataService.hubConnection.off('UpdateItemsByMediaServer');
    this.sharedDataService.hubConnection.off('UpdateItemsByMediaServerAndLibrary');
  }

  private addHubEvents(){
     this.addWebLog({Created: new Date(),Description:"Agregando controladores para los metodos del hub"});
      this.sharedDataService.hubConnection.on('UpdateMediaServers', (message) => {
        this.updateMediaServers();
      });
      this.sharedDataService.hubConnection.on('EnableMediaServer', (mediaServerGuid:string) => {
        var mediaServer=this.sharedDataService.mediaServers.find(x=>x.Guid==mediaServerGuid);
        if(!mediaServer.isSecureConnection)
        {
          mediaServer.isSecureConnection=true;
        }
        this.enableMediaServer(mediaServerGuid);
      });
      this.sharedDataService.hubConnection.on('DisableMediaServer', (mediaServerGuid:string) => {
        var mediaServer=this.sharedDataService.mediaServers.find(x=>x.Guid==mediaServerGuid);
        if(mediaServer.isSecureConnection)
        {
          mediaServer.isSecureConnection=false;
        }
        this.disableMediaServer(mediaServerGuid);
      });
      this.sharedDataService.hubConnection.on('UpdateLibrariesByMediaServer', (mediaServerGuid:string) => {
        this.updateLibrariesByMediaServer(mediaServerGuid);
      });
      this.sharedDataService.hubConnection.on('UpdateItemsByMediaServer', (mediaServerGuid:string) => {
        this.updateItemsByMediaServer(mediaServerGuid);
      });
/*       hubConnection.on('UpdateItemsByMediaServerAndLibrary', (mediaServerGuid:string,libraryGuid:string) => {
      }); */
      this.sharedDataService.hubConnection.on('UpdateCurrentTimeMediaFilePlayBack', (mediaServerGuid:string,mediaFilePlaybackGuid:string,currentTime:number,isPlaying:boolean) => {
        this.updateCurrentTimeMediaFilePlayBack$.next({mediaServerGuid:mediaServerGuid,mediaFilePlaybackGuid:mediaFilePlaybackGuid,currentTime:currentTime,isPlaying:isPlaying});
      });
      this.sharedDataService.hubConnection.on('AddedMediaFilePlayBack', (mediaServerGuid:string,mediaFilePlaybackGuid:string) => {
        this.addedMediaFilePlayBack$.next({mediaServerGuid:mediaServerGuid,mediaFilePlaybackGuid:mediaFilePlaybackGuid});
      });
      this.sharedDataService.hubConnection.on('RemovedMediaFilePlayBack', (mediaServerGuid:string,mediaFilePlaybackGuid:string) => {
        this.removedMediaFilePlayBack$.next({mediaServerGuid:mediaServerGuid,mediaFilePlaybackGuid:mediaFilePlaybackGuid});
      });
  }

  public isRemovedMediaFilePlayback():Observable<any>{
    return this.removedMediaFilePlayBack$.asObservable();
  }

  public isAddedMediaFilePlayback():Observable<any>{
    return this.addedMediaFilePlayBack$.asObservable();
  }

  public removeMediaFilePlayBack(mediaServerGuid:string,mediaFilePlaybackGuid:string){
    let ctx=this;
    this.sharedDataService.hubConnection.send("RemoveMediaFilePlayBack",this.sharedDataService.userData.Guid,mediaServerGuid,mediaFilePlaybackGuid).then(res=>{
      ctx.addWebLog({Created: new Date(),Description:"Se completó la llamada al metodo RemoveMediaFilePlayBack de forma exitosa"});
    },(error)=>{
      ctx.addWebLog({Created: new Date(),Description:"Error al llamar al metodo RemoveMediaFilePlayBack"});
      setTimeout(() => {
        ctx.removeMediaFilePlayBack(mediaServerGuid,mediaFilePlaybackGuid);
      }, 1000,ctx);
    });
  }

  public removeLastTranscodedMediaFileProcess(mediaServerGuid:string,mediaFilePlaybackGuid:string){
    let ctx=this;
    this.sharedDataService.hubConnection.send("RemoveLastTranscodedMediaFileProcess",this.sharedDataService.userData.Guid,mediaServerGuid,mediaFilePlaybackGuid).then(res=>{
      ctx.addWebLog({Created: new Date(),Description:"Se completó la llamada al metodo RemoveLastTranscodedMediaFileProcess de forma exitosa"});
    },(error)=>{
      ctx.addWebLog({Created: new Date(),Description:"Error al llamar al metodo RemoveLastTranscodedMediaFileProcess"});
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
