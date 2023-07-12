
  export enum CatalogEnum
  {
      VideoTransmissionType = 1,
      TranscoderPreset = 2,
      MediaServerState = 3
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

  export enum MediaType
  {
      Movie = 1,
      TvSerie = 2
  }

  export enum MediaServerState
  {
      Started = 1,
      Stopped = 2
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
