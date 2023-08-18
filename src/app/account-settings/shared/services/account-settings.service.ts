import { Injectable } from '@angular/core';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { HttpMethodType } from 'src/app/shared/enums';
import { ChangePasswordModel } from '../models/change-password.model';
import { SetPasswordModel } from '../models/set-password.model';

@Injectable({ providedIn: 'root' })
export class AccountSettingsService {


  constructor(
    private restProvider: RestProviderService,
  ) {
  }

  public setPassword(setPasswordData:SetPasswordModel):Promise<boolean>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/users/SetPassword',setPasswordData).then((result: any) => {
        resolve(true);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

  public changePassword(changePasswordData:ChangePasswordModel):Promise<boolean>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/users/ChangePassword',changePasswordData).then((result: any) => {
        resolve(true);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }




}
