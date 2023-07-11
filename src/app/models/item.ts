import { Season } from "./season";
import { Episode } from "./episode";

export class Item{

  public Title: string;
  public Subtitle: string;
  public CurrentTime: number;
  public DurationTime: number;
  public SeasonNumber: number;
  public EpisodeNumber: number;
  public Name:string;
  public Overview:string;
  public ReleaseDate:Date;
  public FirstAirDate:Date;
  public LastAirDate:Date;
  public TmdbId:number;
  public Imdbid:string;
  public PosterPath:string;
  public PhysicalPath:string;
  public TvSerieId:number;
  public MovieId:number;
  public MovieGenreId:number;
  public GenreId:number;
  public VideoId:number;
  public AccountServerId:number;
  public TvSerieGenreId:number;
  public GenreName:string;
  public IpAddress:string;
  public HostUrl:string;
  public HostState:number;
  public AccountStorageTypeId:number;
  public Created:Date;
  public LastModified:Date;
  public ContinueVideo:boolean;

}
