import { MediaEpisode } from "./media-episode.model";

export class MediaSeason{
  public Id:number;
  public MediaItemId:number;
  public Name: string;
  public Overview:string;
  public SeasonNumber:number;
  public SourceId:string;
  public ListEpisodes:MediaEpisode[];
}
