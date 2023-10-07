import { Injectable } from '@angular/core';
import { RestProviderService } from 'src/app/services/rest-provider.service';
import { HttpMethodType, MediaType } from 'src/app/modules/shared/enums/enums';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { ItemsGroup } from 'src/app/modules/pages/media/models/items-group.model';
import { Item } from 'src/app/modules/pages/media/models/item.model';
import { ItemDetail } from 'src/app/modules/pages/media/models/item-detail.model';

@Injectable({ providedIn: 'root' })
export class MediaItemService {

  constructor(
    private restProvider: RestProviderService,
  ) {
  }

  public getAllMediaItemsBySearchQuery(mediaServerUrl:string,searchQuery:string):Promise<Item[]>{
    return new Promise((resolve, reject) => {
      var path=mediaServerUrl+"/api/mediaItems/GetAllMediaItemsBySearchQuery?searchQuery="+searchQuery;
      this.restProvider.executeHttpMediaServerApi(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        resolve(response.Data);
      },error=>{
        reject(error);
      });
    });
  }


  public getAllMediaItems(mediaServerUrl:string,profileId:number):Promise<ItemsGroup[]>{
    return new Promise((resolve, reject) => {
      var path=mediaServerUrl+"/api/mediaItems/GetAllMediaItems?profileId="+profileId;
      this.restProvider.executeHttpMediaServerApi(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        resolve(response.Data);
      },error=>{
        reject(error);
      });
    });
  }

  public getMediaItemsByLibrary(mediaServerUrl:string,libraryId:number,profileId:number):Promise<ItemsGroup[]>{
    return new Promise((resolve, reject) => {
      var path=mediaServerUrl+"/api/mediaItems/GetMediaItemsByLibrary?libraryId="+libraryId+"&profileId="+profileId;
      this.restProvider.executeHttpMediaServerApi(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        resolve(response.Data);
      },error=>{
        reject(error);
      });
    });
  }

  public getMediaItemsByMediaType(mediaServerUrl:string,mediaTypeId:MediaType,profileId:number):Promise<ItemsGroup[]>{
    return new Promise((resolve, reject) => {
      var path=mediaServerUrl+"/api/mediaItems/GetMediaItemsByMediaType?mediaTypeId="+mediaTypeId+"&profileId="+profileId;
      this.restProvider.executeHttpMediaServerApi(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        resolve(response.Data);
      },error=>{
        reject(error);
      });
    });
  }

  public getMediaItemDetail(mediaServerUrl:string,mediaItemId:number):Promise<ItemDetail>{
    return new Promise((resolve, reject) => {
      var path=mediaServerUrl+"/api/mediaItems/GetMediaItemDetail/"+mediaItemId;
      this.restProvider.executeHttpMediaServerApi(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        resolve(response.Data);
      },error=>{
        reject(error);
      });
    });
  }

  public GetMediaItemDetailByMediaFileAndProfile(mediaServerUrl:string,mediaFileId:number,profileId:number):Promise<ItemDetail>{
    return new Promise((resolve, reject) => {
      var path=mediaServerUrl+"/api/mediaItems/GetMediaItemDetailByMediaFileAndProfile?mediaFileId="+mediaFileId+"&profileId="+profileId;
      this.restProvider.executeHttpMediaServerApi(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        resolve(response.Data);
      },error=>{
        reject(error);
      });
    });
  }

}
