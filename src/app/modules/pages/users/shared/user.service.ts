import { Injectable } from '@angular/core';
import { RestProviderService } from 'src/app/modules/shared/services/rest-provider.service';
import { HttpMethodType } from 'src/app/modules/shared/enums/enums';
import {v4 as uuid} from "uuid";
import { User } from './user.model';
import { SharedService } from 'src/app/modules/shared/services/shared-data.service';
import { SinovadApiPaginationResponse } from 'src/app/modules/shared/models/response/sinovad-api-pagination-response.model';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { UserSession } from './user-session.model';
import { SignalIRHubService } from 'src/app/modules/pages/media/shared/services/signal-ir-hub.service';
import { Observable, Subject } from 'rxjs';
import { MenuService } from 'src/app/modules/pages/menus/shared/menu.service';
export declare type EventHandler = (...args: any[]) => any;

@Injectable({ providedIn: 'root' })
export class UserService {

  lastCallGuid:string;
  completedCallGetUserData$ = new Subject<boolean>();
  calledGetUserData:boolean=false;

  constructor(
    private menuService:MenuService,
    private signalIRHubService:SignalIRHubService,
    private sharedService:SharedService,
    private restProvider: RestProviderService,
  ) {
  }

  public completeCallGetUserData():void{
    this.completedCallGetUserData$.next(true);
  };

  public isCompletedCallGetUserData():Observable<boolean>{
    return this.completedCallGetUserData$.asObservable();
  }

  public clearSessionData(){
    this.calledGetUserData=false;
    this.sharedService.manageMenus=[];
    this.sharedService.currentProfile=undefined;
    this.sharedService.userData=undefined;
    this.sharedService.apiToken=undefined;
    this.signalIRHubService.stopConnection();
    localStorage.removeItem("apiToken");
  }

  public getUserData(){
    this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/users/GetUserData').then((response:SinovadApiGenericResponse) => {
      let userSessionData:UserSession=response.Data;
      if(userSessionData && userSessionData.User)
      {
        this.sharedService.userData=userSessionData.User;
        this.sharedService.mediaServers=userSessionData.MediaServers;
        this.sharedService.linkedAccounts=userSessionData.LinkedAccounts;
        this.sharedService.listProfiles=userSessionData.Profiles;
        this.sharedService.currentProfile=userSessionData.Profiles[0];
        this.signalIRHubService.openConnection();
        this.menuService.getManageMenu();
      }else{
        this.sharedService.apiToken=undefined;
        localStorage.removeItem("apiToken");
      }
      this.calledGetUserData=true;
      this.completeCallGetUserData();
    },error=>{
      this.calledGetUserData=true;
      localStorage.removeItem("apiToken");
      this.completeCallGetUserData();
      console.error(error);
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
