import { Injectable } from '@angular/core';
import { RestProviderService } from 'src/app/services/rest-provider.service';
import { HttpMethodType } from 'src/app/modules/shared/enums/enums';
import { ChangePasswordModel } from '../models/change-password.model';
import { SetPasswordModel } from '../models/set-password.model';
import { ChangeUsernameModel } from '../models/change-username.model';
import { ChangeNamesModel } from '../models/change-names.model';

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

  public changeUsername(changeUsername:ChangeUsernameModel):Promise<boolean>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/users/ChangeUserName',changeUsername).then((result: any) => {
        resolve(true);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

  public changeNanes(changeNames:ChangeNamesModel):Promise<boolean>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/users/ChangeNames',changeNames).then((result: any) => {
        resolve(true);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

}
