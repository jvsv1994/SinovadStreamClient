import { DeviceData } from "src/app/models/device-data.model";

export class MediaFilePlaybackClient{

  public DeviceData: DeviceData;
  public IsPlaying: boolean;
  public CurrentTime: number;
  public Duration: number;
  public LocalIpAddress:string;
}
