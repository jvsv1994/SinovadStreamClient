import { Injectable } from '@angular/core';
import { RestProviderService } from 'src/app/services/rest-provider.service';
import { HttpMethodType, MediaType } from 'src/app/modules/shared/enums/enums';
import {v4 as uuid} from "uuid";
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { Library } from '../models/library.model';
import { ItemsGroup } from 'src/app/modules/pages/media/models/items-group.model';
import { Item } from 'src/app/modules/pages/media/models/item.model';
import { ItemDetail } from 'src/app/modules/pages/media/models/item-detail.model';

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

}
