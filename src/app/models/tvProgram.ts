import { TvProgramGenre } from "./tvProgramGenre";

export class TvProgram{

  public Id: number;
  public Title: string;
  public Subtitle: string;
  public Name:string;
  public Overview:string;
  public ReleaseDate:Date;
  public FirstAirDate:Date;
  public LastAirDate:Date;
  public TmdbId:number;
  public Imdbid:string;
  public PosterPath:string;
  public Created:Date;
  public LastModified:Date;
  public ListItemGenres:TvProgramGenre[];
  public Directors:string;
  public Actors:string;
  public Genres:string;

}
