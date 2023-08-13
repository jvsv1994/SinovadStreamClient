import { Injectable } from '@angular/core';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { HttpMethodType } from 'src/app/shared/enums';
import { SinovadApiGenericResponse } from 'src/app/response/sinovadApiGenericResponse';
import { TranscoderSettings } from './transcoder-settings.model';
export declare type EventHandler = (...args: any[]) => any;

@Injectable({ providedIn: 'root' })
export class TranscoderSettingsService {

  constructor(
    private restProvider: RestProviderService,
  ) {
  }

  public getByMediaServer(mediaServerUrl:string):Promise<TranscoderSettings>{
    return new Promise((resolve, reject) => {
      var path=mediaServerUrl+"/api/transcoderSettings/GetAsync";
      this.restProvider.executeHttpMediaServerApi(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        resolve(response.Data);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

  public saveItem(mediaServerUrl:string,item:TranscoderSettings):Promise<boolean>{
    return new Promise((resolve, reject) => {
      let methodType=item.Id>0?HttpMethodType.PUT:HttpMethodType.POST;
      var path=item.Id>0?"/transcoderSettings/Update":"/transcoderSettings/Create";
      this.restProvider.executeHttpMediaServerApi(methodType,mediaServerUrl+"/api"+path,item).then((response) => {
        resolve(true);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

}