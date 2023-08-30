import { LoadVideoStatus } from "src/app/modules/shared/enums/enums";
import { ItemDetail } from "../../shared/models/item-detail.model";
import { TranscodeRunVideo } from "./transcode-run-video.model";
import { TranscodePrepareVideo } from "./transcode-prepare-video.model";

export class BuilderVideo{

  public ItemDetail: ItemDetail;
  public TranscodeRunVideo: TranscodeRunVideo;
  public TranscodePrepareVideo: TranscodePrepareVideo;
  public LoadStatus: LoadVideoStatus;

}
