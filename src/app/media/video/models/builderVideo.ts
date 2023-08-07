import { LoadVideoStatus } from "src/app/shared/enums";
import { TranscodePrepareVideo } from "./transcodePrepareVideo";
import { TranscodeRunVideo } from "./transcodeRunVideo";
import { ItemDetail } from "src/app/media/shared/item-detail.model";

export class BuilderVideo{

  public ItemDetail: ItemDetail;
  public TranscodeRunVideo: TranscodeRunVideo;
  public TranscodePrepareVideo: TranscodePrepareVideo;
  public LoadStatus: LoadVideoStatus;

}