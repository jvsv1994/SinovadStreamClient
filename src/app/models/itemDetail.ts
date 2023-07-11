import { Episode } from "./episode";
import { Item } from "./item";
import { Season } from "./season";

export class ItemDetail{

  public Id: number;
  public AccountStorageTypeId: number;
  public Adult: boolean;
  public TmdbId:number;
  public OriginalLanguage: string;
  public OriginalTitle: string;
  public Overview: string;
  public Popularity: number;
  public PosterPath: string;
  public BackdropPath: string;
  public ReleaseDate: Date;
  public Title: string;
  public Directors: string;
  public Actors: string;
  public Genres: string;
  public Imdbid:string;
  public Name:string;
  public OriginalName:string;
  public FirstAirDate: Date;
  public LastAirDate: Date;
  public ListSeasons:Season[];
  public CurrentSeason:Season;
  public VideoId:number;
  public VideoTitle:string;
  public CurrentEpisode:Episode;
  public RoutePath:string;
  public PhysicalPath:string;
  public Item:Item;

}
