
  export enum CatalogEnum
  {
    MediaServerState = 1,
    MediaType = 2,
    VideoTransmissionType = 3,
    TranscoderPreset = 4,
    IconTypes = 5
  }

  export enum MediaServerState
  {
      Started = 1,
      Stopped = 2
  }

  export enum MediaType
  {
      Movie = 1,
      TvSerie = 2,
      Music=3,
      Photo=4,
      Other=5
  }

  export enum VideoTransmissionType
  {
      None = 1,
      MPEGDASH = 2,
      HLS = 3
  }

  export enum TranscoderPreset{
    Ultrafast=1,
    Superfast=2,
    Veryfast=3,
    Faster=4,
    Fast=5,
    Medium=6,
    Slow=7,
    Slower=8,
    Veryslow=9
  }

  export enum IconType{
    Image=1,
    FontAwesome=2
  }


export enum HttpMethodType{
  GET=0,
  POST=1,
  PUT=2,
  DELETE=3
}


export enum LoadVideoStatus{
  Empty=0,
  Generated=1,
  Initialized=2,
  LoadedMetada=3,
  LoadedData=4
}

export enum MetadataAgents
{
    SinovadDb = 1,
    TMDb = 2,
    IMDb=3
}
