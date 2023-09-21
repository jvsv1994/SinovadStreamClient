import { Injectable } from '@angular/core';
import { RestProviderService} from 'src/app/services/rest-provider.service';
import { HttpMethodType} from 'src/app/modules/shared/enums/enums';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { SinovadApiPaginationResponse } from 'src/app/modules/shared/models/response/sinovad-api-pagination-response.model';
import {v4 as uuid} from "uuid";
import { Catalog } from '../model/catalog.model';

@Injectable({ providedIn: 'root' })
export class CatalogService {

  lastCallGuid:string;
  constructor(
    private restProvider: RestProviderService,
  ) {
  }


  public getAllWithPagination(pageNumber:number,itemsPerPage:number,sortBy:string,sortDirection:string,searchText:string,searchBy:string): Promise<any>{
    let callGuid=uuid();
    this.lastCallGuid=callGuid;
    var queryParams="?page="+pageNumber.toString()+"&take="+itemsPerPage.toString()+"&sortBy="+sortBy+"&sortDirection="+sortDirection+"&searchText="+searchText+"&searchBy="+searchBy;
    var path="/catalogs/GetAllWithPaginationAsync"+queryParams;
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,path).then((response:SinovadApiPaginationResponse) => {
        if(this.lastCallGuid==callGuid)
        {
          resolve(response);
        }
      },error=>{
        reject(error);
      });
    });
  }

  public getDetailsByCatalogId(catalogId:number): Promise<any>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/catalogs/GetDetailsByCatalogAsync/'+catalogId).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        reject(error);
      });
    });
  }

  public getAllCatalogDetailsByCatalogIds(catalogIds:string): Promise<any>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/catalogs/GetAllCatalogDetailsByCatalogIds?catalogIds='+catalogIds).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        reject(error);
      });
    });
  }

  public deleteItem(itemId:number):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      var path="/catalogs/DeleteAsync/"+itemId;
      this.restProvider.executeSinovadApiService(HttpMethodType.DELETE,path).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

  public deleteItems(list:Catalog[]):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      let listItemIds:number[]=[];
      for(let i=0;i < list.length;i++)
      {
        let item=list[i];
        listItemIds.push(item.Id);
      }
      var listIds=listItemIds.join(",");
      var path="/catalogs/DeleteListAsync/"+listIds;
      this.restProvider.executeSinovadApiService(HttpMethodType.DELETE,path).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

}
