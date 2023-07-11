import { Episode } from "./episode";

export class Season{

  public Id: number;
  public SeasonNumber: number;
  public Name: string;
  public Summary: string;
  public Overview: string;
  public PosterPath: string;
  public TvSerieId: number;
  public TvSerieTmdbId: number;
  public ListEpisodes: Episode[];

}
