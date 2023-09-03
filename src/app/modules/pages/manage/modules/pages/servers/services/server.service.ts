import { Injectable } from '@angular/core';
import { RestProviderService } from 'src/app/modules/shared/services/rest-provider.service';
import { HttpMethodType } from 'src/app/modules/shared/enums/enums';
import {v4 as uuid} from "uuid";
import { SharedDataService } from 'src/app/services/shared-data.service';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { SinovadApiPaginationResponse } from 'src/app/modules/shared/models/response/sinovad-api-pagination-response.model';
import { LibraryService } from 'src/app/modules/pages/settings/modules/pages/server/modules/pages/manage/modules/pages/libraries/services/library.service';
import { MediaServer } from '../models/server.model';
import { Library } from 'src/app/modules/pages/settings/modules/pages/server/modules/pages/manage/modules/pages/libraries/models/library.model';

@Injectable({ providedIn: 'root' })
export class MediaServerService {

  lastCallGuid:string;

  constructor(
    private libraryService:LibraryService,
    private sharedService:SharedDataService,
    private restProvider: RestProviderService,
  ) {
  }

  public getMediaServers(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/mediaServers/GetAllByUserAsync/'+this.sharedService.userData.Id).then((response:SinovadApiGenericResponse) => {
        let mediaServers=response.Data;
        this.sharedService.mediaServers=mediaServers;
        this.sharedService.mediaServers.forEach(mediaServer => {
          this.executeGetLibrariesByMediaServer(mediaServer);
        });
        resolve(true);
      },error=>{
        reject(error);
      });
    });
  }

  public executeGetLibrariesByMediaServer(mediaServer:MediaServer){
    if(mediaServer.isSecureConnection)
    {
      this.libraryService.getLibrariesByMediaServer(mediaServer.Url).then((libraries:Library[]) => {
        mediaServer.ListLibraries=libraries;
      },error=>{
      });
    }else{
      mediaServer.ListLibraries=[];
    }
  }

  public getMediaServerByGuid(guid:string):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/mediaServers/GetByGuidAsync/'+guid).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
    });
  }

  public getItems(userId:number,pageNumber:number,itemsPerPage:number,sortBy:string,sortDirection:string,searchText:string,searchBy:string):Promise<SinovadApiPaginationResponse>{
    return new Promise((resolve, reject) => {
      let callGuid=uuid();
      this.lastCallGuid=callGuid;
      var queryParams="?page="+pageNumber.toString()+"&take="+itemsPerPage.toString()+"&sortBy="+sortBy+"&sortDirection="+sortDirection+"&searchText="+searchText+"&searchBy="+searchBy;
      var path="/mediaServers/GetAllWithPaginationByUserAsync/"+userId+queryParams;
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,path).then((response:SinovadApiPaginationResponse) => {
        if(this.lastCallGuid==callGuid)
        {
          resolve(response);
        }
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

  public saveItem(item:MediaServer):Promise<boolean>{
    return new Promise((resolve, reject) => {
      let methodType=item.Id>0?HttpMethodType.PUT:HttpMethodType.POST;
      var path=item.Id>0?"/mediaServers/Update":"/mediaServers/Create";
      this.restProvider.executeSinovadApiService(methodType,path,item).then((response) => {
        resolve(true);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }
  public deleteItem(itemId:number):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      var path="/mediaServers/Delete/"+itemId;
      this.restProvider.executeSinovadApiService(HttpMethodType.DELETE,path).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

  public deleteItems(list:MediaServer[]):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      let listItemIds:number[]=[];
      for(let i=0;i < list.length;i++)
      {
        let item=list[i];
        listItemIds.push(item.Id);
      }
      var listIds=listItemIds.join(",");
      var path="/mediaServers/DeleteList/"+listIds;
      this.restProvider.executeSinovadApiService(HttpMethodType.DELETE,path).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }



}
