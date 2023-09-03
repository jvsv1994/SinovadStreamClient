import { Injectable } from '@angular/core';
import { RestProviderService } from 'src/app/services/rest-provider.service';
import { HttpMethodType, MediaType } from 'src/app/modules/shared/enums/enums';
import {v4 as uuid} from "uuid";
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { Library } from '../models/library.model';
import { Item } from 'src/app/modules/pages/media-items/models/item.model';
import { ItemsGroup } from 'src/app/modules/pages/media-items/models/items-group.model';
import { ItemDetail } from 'src/app/modules/pages/media-detail/models/item-detail.model';
import { MediaFileProfile } from 'src/app/modules/pages/media-detail/models/media-file-profile.model';

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

}
