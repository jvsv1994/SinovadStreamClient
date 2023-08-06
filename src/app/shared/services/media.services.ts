import { Injectable } from '@angular/core';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { HttpMethodType } from 'src/app/shared/enums';
import { Library } from 'src/app/libraries/shared/library.model';
import {v4 as uuid} from "uuid";

export declare type EventHandler = (...args: any[]) => any;


@Injectable({ providedIn: 'root' })
export class MediaService {

  constructor(
    private restProvider: RestProviderService,
  ) {
  }

  public searchFilesInLibrariesByMediaServer(mediaServerUrl:string,listLibraries:Library[]):Promise<any>{
    return new Promise((resolve, reject) => {
      let logIdentifier=uuid();
      let mediaRequest: any={
        ListStorages:listLibraries,
        LogIdentifier:logIdentifier
      };
      this.restProvider.executeHttpMethodByUrl(HttpMethodType.POST,mediaServerUrl+'/medias/UpdateVideosInListStorages',mediaRequest).then((response) => {
        resolve(response)
      },error=>{
        console.error(error);
        reject(error);
      });
    });
  }

}
