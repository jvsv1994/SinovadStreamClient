import { MediaEpisode } from "./media-episode.model";
import { MediaFilePlayback } from "./media-file-playback.model";
import { MediaFile } from "./media-file.model";
import { MediaItem } from "./media-item.model";
import { MediaSeason } from "./media-season.model";

export class ItemDetail{
  public MediaItem:MediaItem;
  public ListSeasons:MediaSeason[];
  public ListMediaFiles:MediaFile[];
  public CurrentSeason:MediaSeason;
  public CurrentEpisode:MediaEpisode;
  public LastMediaFilePlayback:MediaFilePlayback;

}
