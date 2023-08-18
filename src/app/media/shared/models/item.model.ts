import { MediaType, MetadataAgents } from "src/app/shared/enums";

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
  public PosterPath:string;
  public PhysicalPath:string;
  public TvSerieId:number;
  public MovieId:number;
  public MovieGenreId:number;
  public GenreId:number;
  public VideoId:number;
  public MediaServerId:number;
  public MediaServerGuid:string;
  public LibraryId:number;
  public LibraryGuid:string;
  public GenreName:string;
  public MediaServerUrl:string;
  public MediaServerState:number;
  public MediaType:number;
  public Created:Date;
  public LastModified:Date;
  public ContinueVideo:boolean;
  public SourceId:string;
  public MediaTypeId:MediaType;
  public MetadataAgentsId:MetadataAgents;
  public SearchQuery:string;
  public FileId:number;
  public MediaItemId:number;
  public MediaEpisodeId:number;
}