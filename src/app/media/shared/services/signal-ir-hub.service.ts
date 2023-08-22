import { HttpTransportType, HubConnectionBuilder } from '@microsoft/signalr';
import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';

@Injectable({ providedIn: 'root' })
export class SignalIRHubService {

  constructor(private sharedService:SharedService) {

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
        resolve(true);
      }).catch((err) => {
        console.error('error while establishing signalr connection: ' + err);
        reject(err);
      });
    });
  }

}
