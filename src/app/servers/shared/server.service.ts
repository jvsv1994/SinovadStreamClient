import { Injectable } from '@angular/core';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { HttpMethodType } from 'src/app/shared/enums';
import {v4 as uuid} from "uuid";
import { MediaServer } from './server.model';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { LibraryService } from 'src/app/libraries/shared/library.service';
import { Library } from 'src/app/libraries/shared/library.model';
import { MenuService } from 'src/app/menus/shared/menu.service';
import { SignalIRHubService } from 'src/app/media/shared/services/signal-ir-hub.service';
import { MediaService } from 'src/app/media/shared/services/media.service';
import { SinovadApiGenericResponse } from 'src/app/shared/models/response/sinovad-api-generic-response.model';
import { SinovadApiPaginationResponse } from 'src/app/shared/models/response/sinovad-api-pagination-response.model';

@Injectable({ providedIn: 'root' })
export class MediaServerService {

  lastCallGuid:string;

  constructor(
    private mediaService:MediaService,
    private signalIrHubService:SignalIRHubService,
    private menuService:MenuService,
    private libraryService:LibraryService,
    private sharedService:SharedService,
    private restProvider: RestProviderService,
  ) {
  }

  public getMediaServers(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/mediaServers/GetAllByUserAsync/'+this.sharedService.userData.Id).then((response:SinovadApiGenericResponse) => {
        let mediaServers=response.Data;
        this.sharedService.mediaServers=mediaServers;
        this.menuService.getMediaMenu();
        this.checkSecureConnectionMediaServers();
        resolve(true);
      },error=>{
        reject(error);
      });
    });
  }

  public checkSecureConnectionMediaServers(){
    let ctx=this;
    this.signalIrHubService.openSignalIRHubConnection().then(res=>{
      ctx.sharedService.hubConnection.invoke("AddConnectionToUserClientsGroup",ctx.sharedService.userData.Guid).then(res=>{})
      ctx.sharedService.hubConnection.on('UpdateMediaServers', (message) => {
        console.log("UpdateMediaServers");
      });
      if(ctx.sharedService.mediaServers!=null && ctx.sharedService.mediaServers.length>0)
      {
        ctx.sharedService.mediaServers.forEach(mediaServer => {
          ctx.mediaService.updateMediaItems();
          ctx.executeGetLibrariesByMediaServer(mediaServer);
          ctx.sharedService.hubConnection.invoke("AddConnectionToMediaServerClientsGroup",mediaServer.Guid).then(res=>{})
          ctx.sharedService.hubConnection.on('UpdateItemsByMediaServer', (message) => {
            ctx.mediaService.updateMediaItems();
          });
          ctx.sharedService.hubConnection.on('UpdateLibraries', (message) => {
            ctx.executeGetLibrariesByMediaServer(mediaServer);
          });
        });
      }
    },error=>{

    });
  }

  private executeGetLibrariesByMediaServer(mediaServer:MediaServer){
    this.libraryService.getLibrariesByMediaServer(mediaServer.Url).then((libraries:Library[]) => {
      mediaServer.ListLibraries=libraries;
      mediaServer.isSecureConnection=true;
      this.libraryService.updateLibraries();
      this.mediaService.updateMediaItems();
    },error=>{
      mediaServer.ListLibraries=[];
      mediaServer.isSecureConnection=false;
      this.libraryService.updateLibraries();
      this.mediaService.updateMediaItems();
    });
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
