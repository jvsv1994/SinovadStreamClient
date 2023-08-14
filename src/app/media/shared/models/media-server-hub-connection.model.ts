import { HubConnection } from "@microsoft/signalr";
import { MediaServer } from "src/app/servers/shared/server.model";

export class MediaServerHubConnection{
  public MediaServer:MediaServer;
  public HubConnection:HubConnection;
}
