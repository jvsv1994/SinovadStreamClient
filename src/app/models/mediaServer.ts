import { MediaServerState } from "../Enums";


export class MediaServer{

  public Id?: number;
  public IpAddress:string;
  public UserId: number;
  public State?: MediaServerState;
  public HostUrl: string;

}
