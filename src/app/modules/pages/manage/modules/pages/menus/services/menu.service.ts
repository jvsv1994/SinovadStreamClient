import { Injectable } from '@angular/core';
import { RestProviderService } from 'src/app/services/rest-provider.service';
import { HttpMethodType} from 'src/app/modules/shared/enums/enums';
import {v4 as uuid} from "uuid";
import { SharedDataService } from 'src/app/services/shared-data.service';
import { Observable, Subject } from 'rxjs';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { SinovadApiPaginationResponse } from 'src/app/modules/shared/models/response/sinovad-api-pagination-response.model';
import { Menu } from '../models/menu.model';

@Injectable({ providedIn: 'root' })
export class MenuService {

  lastCallGuid:string;
  completedLoadUserManageMenu$ = new Subject<boolean>();
  loadedManageMenu:boolean=false;

  constructor(
    public sharedDataService:SharedDataService,
    private restProvider: RestProviderService,
  ) {}


  public completeLoadUserManageMenu():void{
    this.completedLoadUserManageMenu$.next(true);
  };

  public isCompletedLoadUserManageMenu():Observable<boolean>{
    return this.completedLoadUserManageMenu$.asObservable();
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
      var path=menu.Id>0?"/menus/UpdateAsync/"+menu.Id:"/menus/CreateAsync";
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
      var path="/menus/DeleteAsync/"+itemId;
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
      var path="/menus/DeleteListAsync/"+listIds;
      this.restProvider.executeSinovadApiService(HttpMethodType.DELETE,path).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }



}
