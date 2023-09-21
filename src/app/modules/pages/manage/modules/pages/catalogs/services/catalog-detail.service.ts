import { Injectable } from '@angular/core';
import { RestProviderService} from 'src/app/services/rest-provider.service';
import { HttpMethodType} from 'src/app/modules/shared/enums/enums';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { SinovadApiPaginationResponse } from 'src/app/modules/shared/models/response/sinovad-api-pagination-response.model';
import {v4 as uuid} from "uuid";
import { Catalog } from '../model/catalog.model';
import { CatalogDetail } from '../model/catalog-detail.model';

@Injectable({ providedIn: 'root' })
export class CatalogDetailService {

  lastCallGuid:string;
  constructor(
    private restProvider: RestProviderService,
  ) {
  }

  public get(catalogId:number,catalogDetailId:number){
    return new Promise((resolve, reject) => {
      var path="/catalogs/"+catalogId+"/details/GetAsync/"+catalogDetailId;
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        reject(error);
      });
    });
  }

  public save(catalogDetail:CatalogDetail)
  {
    return new Promise((resolve, reject) => {
      var path=catalogDetail.Id>0?"/catalogs/"+catalogDetail.CatalogId+"/details/UpdateAsync/"+catalogDetail.Id:"/catalogs/"+catalogDetail.CatalogId+"/details/CreateAsync";
      var httpMethodType=catalogDetail.Id>0?HttpMethodType.PUT:HttpMethodType.POST;
      this.restProvider.executeSinovadApiService(httpMethodType,path,catalogDetail).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        reject(error);
      });
    });
  }


  public getAllWithPagination(catalogId:number,pageNumber:number,itemsPerPage:number,sortBy:string,sortDirection:string,searchText:string,searchBy:string): Promise<any>{
    let callGuid=uuid();
    this.lastCallGuid=callGuid;
    var queryParams="?page="+pageNumber.toString()+"&take="+itemsPerPage.toString()+"&sortBy="+sortBy+"&sortDirection="+sortDirection+"&searchText="+searchText+"&searchBy="+searchBy;
    var path="/catalogs/"+catalogId+"/details/GetAllWithPaginationAsync"+queryParams;
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

  public delete(catalogId:number,catalogDetailId:number):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      var path="/catalogs/"+catalogId+"/details/DeleteAsync/"+catalogDetailId;
      this.restProvider.executeSinovadApiService(HttpMethodType.DELETE,path).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

  public deleteList(catalogId:number,list:CatalogDetail[]):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      let listItemIds:number[]=[];
      for(let i=0;i < list.length;i++)
      {
        let item=list[i];
        listItemIds.push(item.Id);
      }
      var listIds=listItemIds.join(",");
      var path="/catalogs/"+catalogId+"/details/DeleteListAsync/"+listIds;
      this.restProvider.executeSinovadApiService(HttpMethodType.DELETE,path).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

}
