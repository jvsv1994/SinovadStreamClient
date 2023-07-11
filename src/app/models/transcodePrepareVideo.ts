import { CustomStream } from "./customStream";

export class TranscodePrepareVideo{

  public Title: string;
  public VideoId: number;
  public HostUrl: string;
  public CurrentTime: number;
  public AccountServerId: number;
  public PhysicalPath: string;
  public ProcessGUID:string;
  public TimeSpan: string;
  public TotalSeconds: number;
  public TranscodeDirectoryPhysicalPath: string;
  public TranscodeDirectoryRoutePath: string;
  public VideoOutputName: string;
  public FinalCommandGenerateStreams: string;
  public FinalCommandGenerateSubtitles: string;
  public ListAudioStreams: CustomStream[];
  public ListSubtitlesStreams: CustomStream[];
  public TransmissionMethodId: number;
  public Preset: string;

}
