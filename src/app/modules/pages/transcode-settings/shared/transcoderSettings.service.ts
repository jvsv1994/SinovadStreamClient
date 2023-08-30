import { Injectable } from '@angular/core';
import { RestProviderService } from 'src/app/modules/shared/services/rest-provider.service';
import { HttpMethodType } from 'src/app/modules/shared/enums';
import { TranscoderSettings } from './transcoder-settings.model';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';

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
      var path="/transcoderSettings/Save";
      this.restProvider.executeHttpMediaServerApi(HttpMethodType.PUT,mediaServerUrl+"/api"+path,item).then((response) => {
        resolve(true);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

}
