import { MediaFilePlaybackClient } from "./media-file-playback-client.model";
import { MediaFilePlaybackItem } from "./media-file-playback-item.model";
import { MediaFilePlaybackProfile } from "./media-file-playback-profile.model";

export class MediaFilePlaybackRealTime{
  public Guid: string;
  public ClientData:MediaFilePlaybackClient;
  public ItemData:MediaFilePlaybackItem;
  public ProfileData:MediaFilePlaybackProfile;
}
