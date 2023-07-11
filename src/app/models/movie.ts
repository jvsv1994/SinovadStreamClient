import { MovieGenre } from "./movieGenre";

export class Movie{

  public Id: number;
  public Adult: Boolean;
  public OriginalLanguage: string;
  public OriginalTitle: string;
  public Overview: string;
  public Popularity: Number;
  public PosterPath: string;
  public BackdropPath: string;
  public ReleaseDate: Date;
  public Title: string;
  public Directors: string;
  public Actors: string;
  public Genres: string;
  public Imdbid: string;
  public ListItemGenres: MovieGenre[];

}
