import { Injectable } from '@angular/core';
import { RestProviderService } from 'src/app/modules/shared/services/rest-provider.service';
import { HttpMethodType, MediaType } from 'src/app/modules/shared/enums/enums';
import { Library } from './library.model';
import {v4 as uuid} from "uuid";
import { MediaServer } from 'src/app/modules/pages/servers/shared/server.model';
import { ItemsGroup } from 'src/app/modules/pages/media/shared/models/items-group.model';
import { Item } from 'src/app/modules/pages/media/shared/models/item.model';
import { ItemDetail } from 'src/app/modules/pages/media/shared/models/item-detail.model';
import { MediaFilePlayback } from 'src/app/modules/pages/media/shared/models/media-file-playback.model';
import { MediaEpisode } from 'src/app/modules/pages/media/shared/models/media-episode.model';
import { TranscodePrepareVideo } from 'src/app/modules/pages/media/video/models/transcode-prepare-video.model';
import { BuilderVideo } from 'src/app/modules/pages/media/video/models/builder-video.model';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';

@Injectable({ providedIn: 'root' })
export class LibraryService {

  constructor(
    private restProvider: RestProviderService,
  ) {
  }

  public getLibrariesByMediaServer(mediaServerUrl:string):Promise<Library[]>{
    return new Promise((resolve, reject) => {
      var path=mediaServerUrl+"/api/libraries/GetAllLibraries";
      this.restProvider.executeHttpMediaServerApi(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        resolve(response.Data);
      },error=>{
        reject(error);
      });
   });
  }

  public saveItem(mediaServerUrl:string,item:Library):Promise<boolean>{
    return new Promise((resolve, reject) => {
      let methodType=item.Id>0?HttpMethodType.PUT:HttpMethodType.POST;
      var path=item.Id>0?"/libraries/Update":"/libraries/Create";
      this.restProvider.executeHttpMediaServerApi(methodType,mediaServerUrl+"/api"+path,item).then((response) => {
        resolve(true);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

  public deleteItem(mediaServerUrl:string,itemId:number):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      var path=mediaServerUrl+"/api/libraries/Delete/"+itemId;
      this.restProvider.executeHttpMediaServerApi(HttpMethodType.DELETE,path).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

  public deleteItems(mediaServerUrl:string,list:Library[]):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      let listItemIds:number[]=[];
      for(let i=0;i < list.length;i++)
      {
        let item=list[i];
        listItemIds.push(item.Id);
      }
      var listIds=listItemIds.join(",");
      var path=mediaServerUrl+"/api/libraries/DeleteList/"+listIds;
      this.restProvider.executeHttpMediaServerApi(HttpMethodType.DELETE,path).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

  public searchFiles(mediaServerUrl:string,listLibraries:Library[]):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      let logIdentifier=uuid();
      let mediaRequest: any={
        Listlibraries:listLibraries,
        LogIdentifier:logIdentifier
      };
      var path=mediaServerUrl+"/api/libraries/SearchFiles";
      this.restProvider.executeHttpMediaServerApi(HttpMethodType.POST,path,mediaRequest).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

  public getAllMediaItemsBySearchQuery(mediaServerUrl:string,searchQuery:string):Promise<Item[]>{
    return new Promise((resolve, reject) => {
      var path=mediaServerUrl+"/api/libraries/GetAllMediaItemsBySearchQuery?searchQuery="+searchQuery;
      this.restProvider.executeHttpMediaServerApi(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        resolve(response.Data);
      },error=>{
        reject(error);
      });
    });
  }


  public getAllMediaItems(mediaServerUrl:string,profileId:number):Promise<ItemsGroup[]>{
    return new Promise((resolve, reject) => {
      var path=mediaServerUrl+"/api/libraries/GetAllMediaItems?profileId="+profileId;
      this.restProvider.executeHttpMediaServerApi(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        resolve(response.Data);
      },error=>{
        reject(error);
      });
    });
  }

  public getMediaItemsByLibrary(mediaServerUrl:string,libraryId:number,profileId:number):Promise<ItemsGroup[]>{
    return new Promise((resolve, reject) => {
      var path=mediaServerUrl+"/api/libraries/GetMediaItemsByLibrary?libraryId="+libraryId+"&profileId="+profileId;
      this.restProvider.executeHttpMediaServerApi(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        resolve(response.Data);
      },error=>{
        reject(error);
      });
    });
  }

  public getMediaItemsByMediaType(mediaServerUrl:string,mediaTypeId:MediaType,profileId:number):Promise<ItemsGroup[]>{
    return new Promise((resolve, reject) => {
      var path=mediaServerUrl+"/api/libraries/GetMediaItemsByMediaType?mediaTypeId="+mediaTypeId+"&profileId="+profileId;
      this.restProvider.executeHttpMediaServerApi(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        resolve(response.Data);
      },error=>{
        reject(error);
      });
    });
  }

  public getMediaItemDetail(mediaServerUrl:string,mediaItemId:number):Promise<ItemDetail>{
    return new Promise((resolve, reject) => {
      var path=mediaServerUrl+"/api/libraries/GetMediaItemDetail/"+mediaItemId;
      this.restProvider.executeHttpMediaServerApi(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        resolve(response.Data);
      },error=>{
        reject(error);
      });
    });
  }

  public GetMediaItemDetailByMediaFileAndProfile(mediaServerUrl:string,mediaFileId:number,profileId:number):Promise<ItemDetail>{
    return new Promise((resolve, reject) => {
      var path=mediaServerUrl+"/api/libraries/GetMediaItemDetailByMediaFileAndProfile?mediaFileId="+mediaFileId+"&profileId="+profileId;
      this.restProvider.executeHttpMediaServerApi(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        resolve(response.Data);
      },error=>{
        reject(error);
      });
    });
  }


  public updateMediaFilePlayback(mediaServerUrl:string,mediaFilePlayback:MediaFilePlayback):Promise<ItemDetail>{
    return new Promise((resolve, reject) => {
      var path=mediaServerUrl+"/api/libraries/UpdateMediaFilePlayback";
      this.restProvider.executeHttpMediaServerApi(HttpMethodType.PUT,path,mediaFilePlayback).then((response:SinovadApiGenericResponse) => {
        resolve(response.Data);
      },error=>{
        reject(error);
      });
    });
  }

  public CreateBuilderVideoFromItem(detail:ItemDetail,mediaServer:MediaServer,currentTime?:number):BuilderVideo{
    let processGUID=uuid();
    var mediaFile=detail.ListMediaFiles[0];
    var transcodeVideo= new TranscodePrepareVideo();
    transcodeVideo.VideoId=mediaFile.Id;
    transcodeVideo.Title=detail.MediaItem.ExtendedTitle;
    transcodeVideo.PhysicalPath=mediaFile.PhysicalPath;
    transcodeVideo.MediaServerId=mediaServer.Id;
    transcodeVideo.MediaServerUrl=mediaServer.Url;
    transcodeVideo.CurrentTime=currentTime?currentTime:0;
    transcodeVideo.ProcessGUID=processGUID;
    if(transcodeVideo.CurrentTime)
    {
      transcodeVideo.TimeSpan=transcodeVideo.CurrentTime.toString();
    }else{
      transcodeVideo.TimeSpan="0";
    }
    var builderVideo= new BuilderVideo();
    builderVideo.TranscodePrepareVideo=transcodeVideo;
    builderVideo.ItemDetail=detail;
    return builderVideo;
  }

  public CreateBuilderVideoFromEpisode(detail:ItemDetail,episode:MediaEpisode,mediaServer:MediaServer,currentTime?:number):BuilderVideo{
    var transcodeVideo:TranscodePrepareVideo=this.GetTranscodeVideoFromEpisode(detail,episode,mediaServer,currentTime);
    if(detail.ListSeasons)
    {
      detail.CurrentSeason=detail.ListSeasons.find(item=>item.SeasonNumber==episode.SeasonNumber);
      detail.CurrentEpisode=detail.CurrentSeason.ListEpisodes.find(item=>item.EpisodeNumber==episode.EpisodeNumber);
    }
    var builderVideo= new BuilderVideo();
    builderVideo.TranscodePrepareVideo=transcodeVideo;
    builderVideo.ItemDetail=detail;
    return builderVideo;
  }

  public GetTranscodeVideoFromEpisode(detail:ItemDetail,episode:MediaEpisode,mediaServer:MediaServer,currentTime?:number):TranscodePrepareVideo{
    var mediaFile=episode.ListMediaFiles[0];
    let processGUID=uuid();
    var transcodeVideo= new TranscodePrepareVideo();
    transcodeVideo.VideoId=mediaFile.Id;
    transcodeVideo.Title=detail.MediaItem.Title;
    transcodeVideo.Subtitle="T"+episode.SeasonNumber+":E"+episode.EpisodeNumber+" "+episode.Name;
    transcodeVideo.PhysicalPath=mediaFile.PhysicalPath;
    transcodeVideo.MediaServerId=mediaServer.Id;
    transcodeVideo.MediaServerUrl=mediaServer.Url;
    transcodeVideo.ProcessGUID=processGUID;
    transcodeVideo.CurrentTime=currentTime?currentTime:0;
    if(transcodeVideo.CurrentTime)
    {
      transcodeVideo.TimeSpan=transcodeVideo.CurrentTime.toString();
    }else{
      transcodeVideo.TimeSpan="0";
    }
    return transcodeVideo;
  }

}
