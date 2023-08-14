import { HttpTransportType, HubConnectionBuilder } from '@microsoft/signalr';

import { Injectable } from '@angular/core';
import { MediaServer } from 'src/app/servers/shared/server.model';
import { MediaServerHubConnection } from '../models/media-server-hub-connection.model';
import { SharedService } from 'src/app/shared/services/shared-data.service';

@Injectable({ providedIn: 'root' })
export class SignalIRHubService {

  constructor(private sharedService:SharedService) {

  }

  public openConnectionByMediaServer(mediaServer:MediaServer):Promise<any>{
    let ctx=this;
    return new Promise((resolve, reject) => {
      var hubConnection = new HubConnectionBuilder().withUrl(mediaServer.Url+'/sinovadHub', {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      }).build();
      hubConnection.start().then(() => {
        console.log('connection started');
        var mediaServerHubConnection= new MediaServerHubConnection();
        mediaServerHubConnection.MediaServer=mediaServer;
        mediaServerHubConnection.HubConnection=hubConnection;
        ctx.sharedService.mediaServerHubConnections.push(mediaServerHubConnection);
        resolve(true);
      }).catch((err) => {
        console.error('error while establishing signalr connection: ' + err);
        reject(err);
      });
    });
  }

}
