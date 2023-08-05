import { Injectable } from '@angular/core';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { HttpMethodType } from 'src/app/shared/enums';
import { SinovadApiPaginationResponse } from 'src/app/response/sinovadApiPaginationResponse';
export declare type EventHandler = (...args: any[]) => any;

@Injectable({ providedIn: 'root' })
export class DirectoryService {

  lastCallGuid:string;

  constructor(
    private restProvider: RestProviderService,
  ) {
  }

  public getDirectories(mediaServerUrl:string):Promise<SinovadApiPaginationResponse>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeHttpMethodByUrl(HttpMethodType.GET,mediaServerUrl+"/directories").then((response) => {
        resolve(response)
      },error=>{
        console.error(error);
      });
    });
  }

}
