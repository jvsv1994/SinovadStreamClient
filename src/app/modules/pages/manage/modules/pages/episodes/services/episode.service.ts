import { Injectable } from '@angular/core';
import { RestProviderService } from 'src/app/modules/shared/services/rest-provider.service';
import { HttpMethodType } from 'src/app/modules/shared/enums/enums';
import {v4 as uuid} from "uuid";
import { SinovadApiPaginationResponse } from 'src/app/modules/shared/models/response/sinovad-api-pagination-response.model';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { Episode } from '../models/episode.model';
export declare type EventHandler = (...args: any[]) => any;

@Injectable({ providedIn: 'root' })
export class EpisodeService {

  lastCallGuid:string;

  constructor(
    private restProvider: RestProviderService,
  ) {
  }

  public getItems(seasonId:number,pageNumber:number,itemsPerPage:number,sortBy:string,sortDirection:string,searchText:string,searchBy:string):Promise<SinovadApiPaginationResponse>{
    return new Promise((resolve, reject) => {
      let callGuid=uuid();
      this.lastCallGuid=callGuid;
      var queryParams="?page="+pageNumber.toString()+"&take="+itemsPerPage.toString()+"&sortBy="+sortBy+"&sortDirection="+sortDirection+"&searchText="+searchText+"&searchBy="+searchBy;
      var path="/episodes/GetAllWithPaginationBySeasonAsync/"+seasonId+queryParams;
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

  public saveItem(item:Episode):Promise<boolean>{
    return new Promise((resolve, reject) => {
      let methodType=item.Id>0?HttpMethodType.PUT:HttpMethodType.POST;
      var path=item.Id>0?"/episodes/Update":"/episodes/Create";
      this.restProvider.executeSinovadApiService(methodType,path,item).then((response) => {
        resolve(true);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

  public createList(listItems:Episode[]):Promise<boolean>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/episodes/CreateList',listItems).then((response) => {
        resolve(true);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }


  public deleteItem(itemId:number):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      var path="/episodes/Delete/"+itemId;
      this.restProvider.executeSinovadApiService(HttpMethodType.DELETE,path).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

  public deleteItems(list:Episode[]):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      let listItemIds:number[]=[];
      for(let i=0;i < list.length;i++)
      {
        let item=list[i];
        listItemIds.push(item.Id);
      }
      var listIds=listItemIds.join(",");
      var path="/episodes/DeleteList/"+listIds;
      this.restProvider.executeSinovadApiService(HttpMethodType.DELETE,path).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }



}
