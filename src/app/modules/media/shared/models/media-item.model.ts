import { MediaType, MetadataAgents } from "src/app/modules/shared/enums";

export class MediaItem{
  public Id:number;
  public Title: string;
  public ExtendedTitle: string;
  public Overview:string;
  public Actors:string;
  public Directors:string;
  public Genres:string;
  public ReleaseDate:Date;
  public FirstAirDate:Date;
  public LastAirDate:Date;
  public PosterPath:string;
  public SourceId:string;
  public MediaTypeId:MediaType;
  public MetadataAgentsId:MetadataAgents;
  public SearchQuery:string;
}
