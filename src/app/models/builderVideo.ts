import { LoadVideoStatus } from "../Enums";
import { ItemDetail } from "./itemDetail";
import { TranscodePrepareVideo } from "./transcodePrepareVideo";
import { TranscodeRunVideo } from "./transcodeRunVideo";

export class BuilderVideo{

  public ItemDetail: ItemDetail;
  public TranscodeRunVideo: TranscodeRunVideo;
  public TranscodePrepareVideo: TranscodePrepareVideo;
  public LoadStatus: LoadVideoStatus;

}
