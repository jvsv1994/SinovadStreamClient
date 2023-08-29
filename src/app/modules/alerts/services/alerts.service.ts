import { Injectable } from '@angular/core';
import { HttpMethodType } from 'src/app/shared/enums';
import { SinovadApiPaginationResponse } from 'src/app/shared/models/response/sinovad-api-pagination-response.model';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor(private restProvider: RestProviderService,
    ) { }

  public getAlertsByMediaServer(mediaServerUrl:string,pageNumber:number,itemsPerPage:number):Promise<SinovadApiPaginationResponse>{
    return new Promise((resolve, reject) => {
      var queryParams="?page="+pageNumber.toString()+"&take="+itemsPerPage.toString();
      var path=mediaServerUrl+"/api/alerts/GetAllWithPagination"+queryParams;
      this.restProvider.executeHttpMediaServerApi(HttpMethodType.GET,path).then((response:SinovadApiPaginationResponse) => {
        resolve(response);
      },error=>{
        reject(error);
      });
   });
  }
}
