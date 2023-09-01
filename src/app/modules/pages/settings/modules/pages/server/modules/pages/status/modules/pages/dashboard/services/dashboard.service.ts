import { Injectable } from '@angular/core';
import { MediaFilePlaybackRealTime } from 'src/app/modules/pages/media-video/models/media-file-playback-real-time.model';
import { HttpMethodType } from 'src/app/modules/shared/enums/enums';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { RestProviderService } from 'src/app/modules/shared/services/rest-provider.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private restProvider:RestProviderService
  ) { }

  public GetListMediaFilePlaybackRealTime(mediaServerUrl:string):Promise<MediaFilePlaybackRealTime[]>{
    return new Promise((resolve, reject) => {
      var path=mediaServerUrl+"/api/mediaFilePlaybacks/GetListMediaFilePlaybackRealTime";
      this.restProvider.executeHttpMediaServerApi(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        resolve(response.Data);
      },error=>{
        reject(error);
      });
   });
  }

}
