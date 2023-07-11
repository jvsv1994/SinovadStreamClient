
  export enum RolEnum{
    Administrator=1,
    User=2
  }

  export enum CatalogEnum
  {
      TransmissionMethod = 1,
      Preset = 2,
      ServerState = 3
  }

  export enum TransmissionMethod
  {
      None = 1,
      MPEGDASH = 2,
      HLS = 3
  }

  export enum ItemType
  {
      Movie = 1,
      TvSerie = 2
  }

  export enum ServerState
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
