import { Season } from "../../seasons/models/season.model";
import { TvSerieGenre } from "./tvserie-genre.model";

export class TvSerie{

  public Id:number;
  public Name:string;
  public TmdbId:number;
  public OriginalLanguage: string;
  public OriginalName: string;
  public Overview: string;
  public Popularity: number;
  public PosterPath:string;
  public BackdropPath:string;
  public FirstAirDate:Date;
  public LastAirDate:Date;
  public Directors:string;
  public Genres:string;
  public Actors:string;
  public TvSerieGenres:TvSerieGenre[];
  public GenresIds:number[];

}
