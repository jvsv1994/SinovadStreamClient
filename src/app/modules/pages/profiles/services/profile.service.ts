import { Injectable } from '@angular/core';
import { RestProviderService } from 'src/app/modules/shared/services/rest-provider.service';
import { HttpMethodType } from 'src/app/modules/shared/enums/enums';
import {v4 as uuid} from "uuid";
import { SharedDataService } from 'src/app/services/shared-data.service';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { SinovadApiPaginationResponse } from 'src/app/modules/shared/models/response/sinovad-api-pagination-response.model';
import { Profile } from '../models/profile.model';
export declare type EventHandler = (...args: any[]) => any;

@Injectable({ providedIn: 'root' })
export class ProfileService {

  lastCallGuid:string;

  constructor(
    private sharedDataService:SharedDataService,
    private restProvider: RestProviderService,
  ) {
  }

  public uploadAvatarProfile(formData:FormData):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      var url="/documents/UploadAvatarProfile";
      this.restProvider.executeHttpPostMethodWithFormData(url,formData).then((response: any) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
    });
  }

  public getProfileById(id:number):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/profiles/GetAsync/'+id).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
    });
  }

  public getProfileByGuid(guid:string):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/profiles/GetByGuidAsync/'+guid).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
    });
  }
  public getAllProfiles(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/profiles/GetAllWithPaginationByUserAsync/'+this.sharedDataService.userData.Id).then((response:SinovadApiGenericResponse) => {
        let listProfiles=response.Data;
        this.sharedDataService.listProfiles=listProfiles;
        this.sharedDataService.currentProfile=listProfiles[0];
        resolve(true);
      },error=>{
        reject(error);
      });
    });
  }


  public getProfiles(userId:number,pageNumber:number,itemsPerPage:number,sortBy:string,sortDirection:string,searchText:string,searchBy:string):Promise<SinovadApiPaginationResponse>{
    return new Promise((resolve, reject) => {
      let callGuid=uuid();
      this.lastCallGuid=callGuid;
      var queryParams="?page="+pageNumber.toString()+"&take="+itemsPerPage.toString()+"&sortBy="+sortBy+"&sortDirection="+sortDirection+"&searchText="+searchText+"&searchBy="+searchBy;
      var path="/profiles/GetAllWithPaginationByUserAsync/"+userId+queryParams;
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

  public saveItem(item:Profile):Promise<boolean>{
    return new Promise((resolve, reject) => {
      let methodType=item.Id>0?HttpMethodType.PUT:HttpMethodType.POST;
      var path=item.Id>0?"/profiles/Update":"/profiles/Create";
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
      var path="/profiles/Delete/"+itemId;
      this.restProvider.executeSinovadApiService(HttpMethodType.DELETE,path).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

  public deleteItems(list:Profile[]):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      let listItemIds:number[]=[];
      for(let i=0;i < list.length;i++)
      {
        let item=list[i];
        listItemIds.push(item.Id);
      }
      var listIds=listItemIds.join(",");
      var path="/profiles/DeleteList/"+listIds;
      this.restProvider.executeSinovadApiService(HttpMethodType.DELETE,path).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }



}
