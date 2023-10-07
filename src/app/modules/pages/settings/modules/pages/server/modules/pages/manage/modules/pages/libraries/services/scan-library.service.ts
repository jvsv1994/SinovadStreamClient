import { Injectable } from '@angular/core';
import { RestProviderService } from 'src/app/services/rest-provider.service';
import { HttpMethodType} from 'src/app/modules/shared/enums/enums';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { Library } from '../models/library.model';

@Injectable({ providedIn: 'root' })
export class ScanLibraryService {

  constructor(
    private restProvider: RestProviderService,
  ) {
  }

  public scanLibraries(mediaServerUrl:string,listLibraries:Library[]):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      let mediaRequest: any={
        Listlibraries:listLibraries
      };
      var path=mediaServerUrl+"/api/scanLibraries";
      this.restProvider.executeHttpMediaServerApi(HttpMethodType.POST,path,mediaRequest).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

}
