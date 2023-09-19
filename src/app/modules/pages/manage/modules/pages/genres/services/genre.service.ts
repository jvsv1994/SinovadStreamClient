import { Injectable } from '@angular/core';
import { RestProviderService } from 'src/app/services/rest-provider.service';
import { HttpMethodType } from 'src/app/modules/shared/enums/enums';
import {v4 as uuid} from "uuid";
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { SinovadApiPaginationResponse } from 'src/app/modules/shared/models/response/sinovad-api-pagination-response.model';
import { Genre } from '../models/genre.model';
export declare type EventHandler = (...args: any[]) => any;

@Injectable({ providedIn: 'root' })
export class GenreService {

  lastCallGuid:string;

  constructor(
    private restProvider: RestProviderService,
  ) {
  }

  public getAllGenres():Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/genres/GetAllAsync').then((response:SinovadApiGenericResponse) => {
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
      var path="/genres/GetAllWithPaginationAsync"+queryParams;
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

  public saveItem(genre:Genre):Promise<boolean>{
    return new Promise((resolve, reject) => {
      let methodType=genre.Id>0?HttpMethodType.PUT:HttpMethodType.POST;
      var path=genre.Id>0?"/genres/UpdateAsync/"+genre.Id:"/genres/CreateAsync";
      this.restProvider.executeSinovadApiService(methodType,path,genre).then((response) => {
        resolve(true);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }
  public deleteItem(itemId:number):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      var path="/genres/DeleteAsync/"+itemId;
      this.restProvider.executeSinovadApiService(HttpMethodType.DELETE,path).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

  public deleteItems(listGenres:Genre[]):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      let listItemIds:number[]=[];
      for(let i=0;i < listGenres.length;i++)
      {
        let item=listGenres[i];
        listItemIds.push(item.Id);
      }
      var listIds=listItemIds.join(",");
      var path="/genres/DeleteListAsync/"+listIds;
      this.restProvider.executeSinovadApiService(HttpMethodType.DELETE,path).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }



}
