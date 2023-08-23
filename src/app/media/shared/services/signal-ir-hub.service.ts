import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SignalIRHubService {

  private connectionCompleted$ = new Subject<boolean>();
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
        this.updateMediaServers();
      });
      hubConnection.on('EnableMediaServer', (mediaServerGuid:string) => {
        this.enableMediaServer(mediaServerGuid);
      });
      hubConnection.on('DisableMediaServer', (mediaServerGuid:string) => {
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
      hubConnection.invoke("AddConnectionToUserClientsGroup",this.sharedService.userData.Guid).then(res=>{})
  }

}
