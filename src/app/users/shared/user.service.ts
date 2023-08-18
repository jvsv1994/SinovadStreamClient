import { Injectable } from '@angular/core';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { HttpMethodType } from 'src/app/shared/enums';
import {v4 as uuid} from "uuid";
import { User } from './user.model';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { SinovadApiPaginationResponse } from 'src/app/shared/models/response/sinovad-api-pagination-response.model';
import { SinovadApiGenericResponse } from 'src/app/shared/models/response/sinovad-api-generic-response.model';
import { UserSession } from './user-session.model';
export declare type EventHandler = (...args: any[]) => any;

@Injectable({ providedIn: 'root' })
export class UserService {

  lastCallGuid:string;

  constructor(
    private sharedService:SharedService,
    private restProvider: RestProviderService,
  ) {
  }

  public clearSessionData(){
    this.sharedService.manageMenus=[];
    this.sharedService.mediaMenu=[];
    this.sharedService.currentProfile=undefined;
    this.sharedService.userData=undefined;
    this.sharedService.apiToken=undefined;
    localStorage.removeItem("apiToken");
  }

  public getUser(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/users/GetUserData').then((response:SinovadApiGenericResponse) => {
        let userSessionData:UserSession=response.Data;
        this.sharedService.userData=userSessionData.User;
        this.sharedService.mediaServers=userSessionData.MediaServers;
        this.sharedService.linkedAccounts=userSessionData.LinkedAccounts;
        this.sharedService.listProfiles=userSessionData.Profiles;
        this.sharedService.currentProfile=userSessionData.Profiles[0];
        if(this.sharedService.userData==null)
        {
          this.sharedService.apiToken=undefined;
          localStorage.removeItem("apiToken");
        }else{
          resolve(true);
        }
      },error=>{
        console.error(error);
        reject(error)
      });
    });
  }

  public getItems(pageNumber:number,itemsPerPage:number,sortBy:string,sortDirection:string,searchText:string,searchBy:string):Promise<SinovadApiPaginationResponse>{
    return new Promise((resolve, reject) => {
      let callGuid=uuid();
      this.lastCallGuid=callGuid;
      var queryParams="?page="+pageNumber.toString()+"&take="+itemsPerPage.toString()+"&sortBy="+sortBy+"&sortDirection="+sortDirection+"&searchText="+searchText+"&searchBy="+searchBy;
      var path="/users/GetAllWithPaginationAsync"+queryParams;
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

  public saveItem(user:User):Promise<boolean>{
    return new Promise((resolve, reject) => {
      let methodType=user.Id>0?HttpMethodType.PUT:HttpMethodType.POST;
      var path=user.Id>0?"/users/Update":"/users/Create";
      this.restProvider.executeSinovadApiService(methodType,path,user).then((response) => {
        resolve(true);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }
  public deleteItem(itemId:number):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      var path="/users/Delete/"+itemId;
      this.restProvider.executeSinovadApiService(HttpMethodType.DELETE,path).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

  public deleteItems(list:User[]):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      let listItemIds:number[]=[];
      for(let i=0;i < list.length;i++)
      {
        let item=list[i];
        listItemIds.push(item.Id);
      }
      var listIds=listItemIds.join(",");
      var path="/users/DeleteList/"+listIds;
      this.restProvider.executeSinovadApiService(HttpMethodType.DELETE,path).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }



}
