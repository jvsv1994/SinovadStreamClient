import { CustomStream } from "./custom-stream.model";

export class TranscodedMediaFile{

  public Guid:string;
  public Url: string;
  public InitialTime: number;
  public Duration: number;
  public ListAudioStreams:CustomStream[];
  public ListSubtitleStreams:CustomStream[];
  public VideoTransmissionTypeId:number;

}
