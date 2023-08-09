import { Injectable } from '@angular/core';
import { Menu } from './menu.model';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { HttpMethodType, MediaType } from 'src/app/shared/enums';
import { SinovadApiPaginationResponse } from 'src/app/response/sinovadApiPaginationResponse';
import { SinovadApiGenericResponse } from 'src/app/response/sinovadApiGenericResponse';
import {v4 as uuid} from "uuid";
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { LibraryService } from 'src/app/libraries/shared/library.service';
import { Library } from 'src/app/libraries/shared/library.model';
export declare type EventHandler = (...args: any[]) => any;

@Injectable({ providedIn: 'root' })
export class MenuService {

  lastCallGuid:string;

  constructor(
    private libraryService:LibraryService,
    public sharedService:SharedService,
    private restProvider: RestProviderService,
  ) {
  }

  public getMediaMenu(){
    var listOptions:Menu[]=[];
    var home = new Menu();
    home.SortOrder = listOptions.length+1;
    home.Title = "Inicio";
    home.Path = "/home";
    home.IconClass = "fa-house fa-solid";
    listOptions.push(home);
    var movies = new Menu();
    movies.SortOrder = listOptions.length + 1;
    movies.Title = "Películas";
    movies.Path = "/media/movies";
    movies.IconClass = "fa-film fa-solid";
    listOptions.push(movies);
    var tvseries = new Menu();
    tvseries.SortOrder = listOptions.length + 1;
    tvseries.Title = "Series";
    tvseries.Path = "/media/tvseries";
    tvseries.IconClass = "fa-tv fa-solid";
    listOptions.push(tvseries);
    this.sharedService.mediaMenu=listOptions;
    this.sharedService.mediaServers.forEach(mediaServer => {
      var ms = new Menu();
      ms.SortOrder = listOptions.length + 1;
      ms.Title = mediaServer.FamilyName!=null && mediaServer.FamilyName!="" ? mediaServer.FamilyName:mediaServer.DeviceName;
      ms.Path = "/media/server/"+mediaServer.Guid;
      ms.ChildMenus=[];
      this.libraryService.getLibrariesByMediaServer(mediaServer.Url).then((libraries:Library[])=>{
        libraries.forEach(library => {
          var ml = new Menu();
          ml.SortOrder = ms.ChildMenus.length + 1;
          ml.Title = library.Name;
          ml.Path = "/media/server/" + mediaServer.Guid+"/libraries/"+library.Id;
          ml.IconClass = library.MediaTypeCatalogDetailId == MediaType.Movie ? "fa-film fa-solid" : "fa-tv fa-solid";
          ms.ChildMenus.push(ml);
        });
      });
      this.sharedService.mediaMenu.push(ms);
    });
  }

  public getManageMenu(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/menus/GetByUserAsync/'+this.sharedService.userData.Id).then((response:SinovadApiGenericResponse) => {
        this.sharedService.listMenus=response.Data;
        resolve(true);
      },error=>{
        reject(error);
      });
    });
  }

  public getAllMenus(){
    return new Promise((resolve, reject) => {
      var path="/menus/GetAllAsync";
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

  public getItems(pageNumber:number,itemsPerPage:number,sortBy:string,sortDirection:string,searchText:string,searchBy:string):Promise<SinovadApiPaginationResponse>{
    return new Promise((resolve, reject) => {
      let callGuid=uuid();
      this.lastCallGuid=callGuid;
      var queryParams="?page="+pageNumber.toString()+"&take="+itemsPerPage.toString()+"&sortBy="+sortBy+"&sortDirection="+sortDirection+"&searchText="+searchText+"&searchBy="+searchBy;
      var path="/menus/GetAllWithPaginationAsync"+queryParams;
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

  public saveItem(menu:Menu):Promise<boolean>{
    return new Promise((resolve, reject) => {
      let methodType=menu.Id>0?HttpMethodType.PUT:HttpMethodType.POST;
      var path=menu.Id>0?"/menus/Update":"/menus/Create";
      this.restProvider.executeSinovadApiService(methodType,path,menu).then((response) => {
        resolve(true);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }
  public deleteItem(itemId:number):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      var path="/menus/Delete/"+itemId;
      this.restProvider.executeSinovadApiService(HttpMethodType.DELETE,path).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

  public deleteItems(listMenus:Menu[]):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      let listItemIds:number[]=[];
      for(let i=0;i < listMenus.length;i++)
      {
        let item=listMenus[i];
        listItemIds.push(item.Id);
      }
      var listIds=listItemIds.join(",");
      var path="/menus/DeleteList/"+listIds;
      this.restProvider.executeSinovadApiService(HttpMethodType.DELETE,path).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }



}
