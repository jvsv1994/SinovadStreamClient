import { MediaFile } from "./media-file.model";

export class MediaEpisode{
  public Id:number;
  public MediaItemId:number;
  public EpisodeNumber: number;
  public SeasonNumber:number;
  public Name:string;
  public Overview:string;
  public PosterPath:string;
  public SourceId:string;
  public ListMediaFiles:MediaFile[];
}
