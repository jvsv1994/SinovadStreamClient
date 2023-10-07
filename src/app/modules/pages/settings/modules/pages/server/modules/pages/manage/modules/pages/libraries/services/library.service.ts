import { Injectable } from '@angular/core';
import { RestProviderService } from 'src/app/services/rest-provider.service';
import { HttpMethodType} from 'src/app/modules/shared/enums/enums';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { Library } from '../models/library.model';

@Injectable({ providedIn: 'root' })
export class LibraryService {

  constructor(
    private restProvider: RestProviderService,
  ) {
  }

  public getLibrariesByMediaServer(mediaServerUrl:string):Promise<Library[]>{
    return new Promise((resolve, reject) => {
      var path=mediaServerUrl+"/api/libraries/GetAllAsync";
      this.restProvider.executeHttpMediaServerApi(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        resolve(response.Data);
      },error=>{
        reject(error);
      });
   });
  }

  public saveItem(mediaServerUrl:string,item:Library):Promise<boolean>{
    return new Promise((resolve, reject) => {
      let methodType=item.Id>0?HttpMethodType.PUT:HttpMethodType.POST;
      var path=item.Id>0?"/libraries/UpdateAsync/"+item.Id:"/libraries/CreateAsync";
      this.restProvider.executeHttpMediaServerApi(methodType,mediaServerUrl+"/api"+path,item).then((response) => {
        resolve(true);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

  public deleteItem(mediaServerUrl:string,itemId:number):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      var path=mediaServerUrl+"/api/libraries/DeleteAsync/"+itemId;
      this.restProvider.executeHttpMediaServerApi(HttpMethodType.DELETE,path).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

}
