import { Injectable } from '@angular/core';
import { RestProviderService } from 'src/app/modules/shared/services/rest-provider.service';
import { HttpMethodType } from 'src/app/modules/shared/enums';
export declare type EventHandler = (...args: any[]) => any;
import hiBase64 from 'hi-base64';


@Injectable({ providedIn: 'root' })
export class DirectoryService {

  lastCallGuid:string;

  constructor(
    private restProvider: RestProviderService,
  ) {
  }

  public getDirectoriesByMediaServer(mediaServerUrl:string):Promise<any>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeHttpMethodByUrl(HttpMethodType.GET,mediaServerUrl+"/api/directories").then((response) => {
        resolve(response)
      },error=>{
        console.error(error);
        reject(error);
      });
    });
  }

  public getSubdirectoriesByMediaServerAndDirectoryPath(mediaServerUrl:string,path:string):Promise<any>{
    return new Promise((resolve, reject) => {
      var base64Path=hiBase64.encode(path);
      this.restProvider.executeHttpMethodByUrl(HttpMethodType.GET,mediaServerUrl+"/api/directories/"+base64Path).then((response) => {
        resolve(response)
      },error=>{
        console.error(error);
        reject(error);
      });
    });
  }

}
