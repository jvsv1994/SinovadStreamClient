import { Injectable } from '@angular/core';
import { MediaFilePlayback } from 'src/app/modules/pages/media/models/media-file-playback.model';
import { HttpMethodType } from 'src/app/modules/shared/enums/enums';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { RestProviderService } from 'src/app/services/rest-provider.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private restProvider:RestProviderService
  ) { }

  public GetListMediaFilePlayback(mediaServerUrl:string):Promise<MediaFilePlayback[]>{
    return new Promise((resolve, reject) => {
      var path=mediaServerUrl+"/api/mediaFilePlaybacks/GetListMediaFilePlayback";
      this.restProvider.executeHttpMediaServerApi(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        resolve(response.Data);
      },error=>{
        reject(error);
      });
   });
  }

}
