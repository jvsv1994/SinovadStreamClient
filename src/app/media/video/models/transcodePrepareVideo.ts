import { CustomStream } from "./customStream";

export class TranscodePrepareVideo{

  public Title: string;
  public Subtitle: string;
  public VideoId: number;
  public MediaServerUrl: string;
  public CurrentTime: number;
  public MediaServerId: number;
  public PhysicalPath: string;
  public ProcessGUID:string;
  public TimeSpan: string;
  public TotalSeconds: number;
  public TranscodeTemporaryFolder: string;
  public TranscodeDirectoryRoutePath: string;
  public VideoOutputName: string;
  public FinalCommandGenerateStreams: string;
  public FinalCommandGenerateSubtitles: string;
  public ListAudioStreams: CustomStream[];
  public ListSubtitlesStreams: CustomStream[];
  public VideoTransmissionTypeId: number;
  public Preset: string;

}
