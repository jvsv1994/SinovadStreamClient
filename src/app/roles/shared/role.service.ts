import { EventEmitter, Injectable } from '@angular/core';
import { Role } from './role.model';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { HttpMethodType } from 'src/app/shared/enums';
import { SinovadApiPaginationResponse } from 'src/app/response/sinovadApiPaginationResponse';
import { SinovadApiGenericResponse } from 'src/app/response/sinovadApiGenericResponse';
import {v4 as uuid} from "uuid";
export declare type EventHandler = (...args: any[]) => any;

@Injectable({ providedIn: 'root' })
export class RoleService {

  showFormModalEvent=new EventEmitter<Role>();
  refreshListEvent=new EventEmitter<boolean>();
  lastCallGuid:string;

  constructor(
    private restProvider: RestProviderService,
  ) {
  }

  public showModal(role:Role){
    this.showFormModalEvent.emit(role);
  }

  public refreshList(){
    this.refreshListEvent.emit(true);
  }

  public getItems(pageNumber:number,itemsPerPage:number,sortBy:string,sortDirection:string,searchText:string,searchBy:string):Promise<SinovadApiPaginationResponse>{
    return new Promise((resolve, reject) => {
      let callGuid=uuid();
      this.lastCallGuid=callGuid;
      var queryParams="?page="+pageNumber.toString()+"&take="+itemsPerPage.toString()+"&sortBy="+sortBy+"&sortDirection="+sortDirection+"&searchText="+searchText+"&searchBy="+searchBy;
      var path="/roles/GetAllWithPaginationAsync"+queryParams;
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

  public saveItem(role:Role):Promise<boolean>{
    return new Promise((resolve, reject) => {
      let methodType=role.Id>0?HttpMethodType.PUT:HttpMethodType.POST;
      var path=role.Id>0?"/roles/Update":"/roles/Create";
      this.restProvider.executeSinovadApiService(methodType,path,role).then((response) => {
        this.refreshListEvent.emit(true);
        resolve(true);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }
  public deleteItem(itemId:number):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      var path="/roles/Delete/"+itemId;
      this.restProvider.executeSinovadApiService(HttpMethodType.DELETE,path).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

  public deleteItems(listRoles:Role[]):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      let listItemIds:number[]=[];
      for(let i=0;i < listRoles.length;i++)
      {
        let item=listRoles[i];
        listItemIds.push(item.Id);
      }
      var listIds=listItemIds.join(",");
      var path="/roles/DeleteList/"+listIds;
      this.restProvider.executeSinovadApiService(HttpMethodType.DELETE,path).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }



}
