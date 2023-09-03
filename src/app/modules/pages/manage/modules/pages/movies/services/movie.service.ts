import { Injectable } from '@angular/core';
import { RestProviderService } from 'src/app/services/rest-provider.service';
import { HttpMethodType } from 'src/app/modules/shared/enums/enums';
import {v4 as uuid} from "uuid";
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { SinovadApiPaginationResponse } from 'src/app/modules/shared/models/response/sinovad-api-pagination-response.model';
import { Movie } from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class MovieService {

  lastCallGuid:string;

  constructor(
    private restProvider: RestProviderService,
  ) {
  }

  public getMovie(itemId:number):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,"/movies/GetAsync/"+itemId).then((response:SinovadApiGenericResponse) => {
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
      var path="/movies/GetAllWithPaginationAsync"+queryParams;
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

  public saveItem(movie:Movie):Promise<boolean>{
    return new Promise((resolve, reject) => {
      let methodType=movie.Id>0?HttpMethodType.PUT:HttpMethodType.POST;
      var path=movie.Id>0?"/movies/Update":"/movies/Create";
      this.restProvider.executeSinovadApiService(methodType,path,movie).then((response) => {
        resolve(true);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }
  public deleteItem(itemId:number):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      var path="/movies/Delete/"+itemId;
      this.restProvider.executeSinovadApiService(HttpMethodType.DELETE,path).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

  public deleteItems(listMovies:Movie[]):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      let listItemIds:number[]=[];
      for(let i=0;i < listMovies.length;i++)
      {
        let item=listMovies[i];
        listItemIds.push(item.Id);
      }
      var listIds=listItemIds.join(",");
      var path="/movies/DeleteList/"+listIds;
      this.restProvider.executeSinovadApiService(HttpMethodType.DELETE,path).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }



}
