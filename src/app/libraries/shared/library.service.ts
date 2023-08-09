import { Injectable } from '@angular/core';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { HttpMethodType } from 'src/app/shared/enums';
import { SinovadApiGenericResponse } from 'src/app/response/sinovadApiGenericResponse';
import { Library } from './library.model';
export declare type EventHandler = (...args: any[]) => any;

@Injectable({ providedIn: 'root' })
export class LibraryService {

  lastCallGuid:string;

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
        console.error(error);
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
