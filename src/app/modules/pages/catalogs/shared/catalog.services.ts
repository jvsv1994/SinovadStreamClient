import { Injectable } from '@angular/core';
import { RestProviderService} from 'src/app/modules/shared/services/rest-provider.service';
import { HttpMethodType} from 'src/app/modules/shared/enums';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';

@Injectable({ providedIn: 'root' })
export class CatalogService {

  constructor(
    private restProvider: RestProviderService,
  ) {
  }

  public getDetailsByCatalogId(catalogId:number): Promise<any>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/catalogs/GetDetailsByCatalogAsync/'+catalogId).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        reject(error);
      });
    });
  }

  public getAllCatalogDetailsByCatalogIds(catalogIds:string): Promise<any>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/catalogs/GetAllCatalogDetailsByCatalogIds?catalogIds='+catalogIds).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        reject(error);
      });
    });
  }

}
