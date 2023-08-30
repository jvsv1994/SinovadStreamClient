import { TranscodePrepareVideo } from "./transcode-prepare-video.model";

export class TranscodeRunVideo{

  public TranscodeProcessStreamId: number;
  public TranscodeProcessSubtitlesId: number;
  public VideoPath: string;
  public VideoOutputTemporaryFolder: string;
  public VideoOutputDirectoryRoutePath: string;
  public TranscodePrepareVideo:TranscodePrepareVideo;

}
