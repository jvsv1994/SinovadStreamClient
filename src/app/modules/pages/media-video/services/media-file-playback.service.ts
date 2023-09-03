import { Injectable } from '@angular/core';
import { HttpMethodType } from 'src/app/modules/shared/enums/enums';
import { RestProviderService } from 'src/app/services/rest-provider.service';
import { MediaFilePlayback } from '../models/media-file-playback.model';
import { RetranscodeMediaFile } from '../models/retranscode-media-file.model';

@Injectable({
  providedIn: 'root'
})
export class MediaFilePlaybackService {

  constructor(private restProvider:RestProviderService) { }

  public createTranscodedMediaFile(mediaServerUrl:string,mediaFilePlayback:MediaFilePlayback): Promise<any>{
    return new Promise((resolve, reject) => {
      let url=mediaServerUrl+"/api/mediaFilePlaybacks/CreateTranscodedMediaFile";
      this.restProvider.executeHttpMediaServerApi(HttpMethodType.POST,url,mediaFilePlayback).then((response) => {
        resolve(response);
      },error=>{
        reject(error);
      });
    });
  }

  public retranscodeMediaFile(mediaServerUrl:string,retranscodeMediaFile:RetranscodeMediaFile): Promise<any>{
    return new Promise((resolve, reject) => {
      let url=mediaServerUrl+"/api/mediaFilePlaybacks/RetranscodeMediaFile";
      this.restProvider.executeHttpMediaServerApi(HttpMethodType.POST,url,retranscodeMediaFile).then((response) => {
        resolve(response);
      },error=>{
        reject(error);
      });
    });
  }


}
