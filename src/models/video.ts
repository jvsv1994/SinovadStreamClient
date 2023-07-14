import { Episode } from "./episode";
import { ItemDetail } from "./itemDetail";
import { Season } from "./season";

export class Video{

  public Title:string;
  public Subtitle:string;
  public PhysicalPath:string;
  public MediaServerId:number;
  public StorageId:number;
  public MediaType:number;
  public VideoId:number;
  public MovieId:number;
  public TvSerieId:number;
  public EpisodeId:number;
  public TmdbId:number;
  public Imdbid:string;
  public Year: number;
  public EpisodeNumber: number;
  public SeasonNumber: number;
  public EpisodeName:string;
  public CurrentEpisode:Episode;
  public CurrentSeason:Season;
  public ItemDetail:ItemDetail;
  public MediaServerUrl:string;
  public CurrentTime:number;

}
