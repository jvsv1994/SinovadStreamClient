import { Injectable } from '@angular/core';
import { RestProviderService } from 'src/app/services/rest-provider.service';
import { HttpMethodType } from 'src/app/modules/shared/enums/enums';
import {v4 as uuid} from "uuid";
import { SharedDataService } from 'src/app/services/shared-data.service';
import { SinovadApiPaginationResponse } from 'src/app/modules/shared/models/response/sinovad-api-pagination-response.model';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { Observable, Subject } from 'rxjs';
import { SignalIRHubService } from 'src/app/services/signal-ir-hub.service';
import { MenuService } from '../../menus/services/menu.service';
import { UserSession } from '../models/user-session.model';
import { User } from '../models/user.model';
import { ValidateConfirmEmailTokenModel } from 'src/app/modules/pages/confirm-email/models/validate-confirm-email-token.model';
import { RecoverPasswordModel } from 'src/app/modules/pages/recover-password/models/recover-password.model';
import { RegisterUserModel } from 'src/app/modules/pages/register-user/models/register-user-model';
import { ValidateResetPasswordTokenModel } from 'src/app/modules/pages/reset-password/models/validate-reset-password-token.model';
import { ResetPasswordModel } from 'src/app/modules/pages/reset-password/models/reset-password.model';
export declare type EventHandler = (...args: any[]) => any;

@Injectable({ providedIn: 'root' })
export class UserService {

  lastCallGuid:string;
  completedCallGetUserData$ = new Subject<boolean>();
  calledGetUserData:boolean=false;

  constructor(
    private menuService:MenuService,
    private signalIRHubService:SignalIRHubService,
    private sharedDataService:SharedDataService,
    private restProvider: RestProviderService,
  ) {
  }

  public completeCallGetUserData():void{
    this.completedCallGetUserData$.next(true);
  };

  public isCompletedCallGetUserData():Observable<boolean>{
    return this.completedCallGetUserData$.asObservable();
  }

  public clearSessionData(){
    this.calledGetUserData=false;
    this.sharedDataService.manageMenus=[];
    this.sharedDataService.currentProfile=undefined;
    this.sharedDataService.userData=undefined;
    this.sharedDataService.apiToken=undefined;
    this.signalIRHubService.stopConnection();
    localStorage.removeItem("apiToken");
  }

  public getUserData(){
    this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/users/GetUserData').then((response:SinovadApiGenericResponse) => {
      let userSessionData:UserSession=response.Data;
      if(userSessionData && userSessionData.User)
      {
        this.sharedDataService.userData=userSessionData.User;
        this.sharedDataService.roles=userSessionData.Roles;
        this.sharedDataService.mediaServers=userSessionData.MediaServers;
        this.sharedDataService.linkedAccounts=userSessionData.LinkedAccounts;
        this.sharedDataService.listProfiles=userSessionData.Profiles;
        this.sharedDataService.currentProfile=userSessionData.Profiles[0];
        this.signalIRHubService.openConnection();
        this.menuService.getManageMenu();
      }else{
        this.sharedDataService.apiToken=undefined;
        localStorage.removeItem("apiToken");
      }
      this.calledGetUserData=true;
      this.completeCallGetUserData();
    },error=>{
      this.calledGetUserData=true;
      localStorage.removeItem("apiToken");
      this.completeCallGetUserData();
      console.error(error);
    });
  }

  public getWithRoles(userId:number):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      var path="/users/GetAsync/"+userId+"/roles";
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

  public getItems(pageNumber:number,itemsPerPage:number,sortBy:string,sortDirection:string,searchText:string,searchBy:string):Promise<SinovadApiPaginationResponse>{
    return new Promise((resolve, reject) => {
      let callGuid=uuid();
      this.lastCallGuid=callGuid;
      var queryParams="?page="+pageNumber.toString()+"&take="+itemsPerPage.toString()+"&sortBy="+sortBy+"&sortDirection="+sortDirection+"&searchText="+searchText+"&searchBy="+searchBy;
      var path="/users/GetAllWithPaginationAsync"+queryParams;
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,path).then((response:SinovadApiPaginationResponse) => {
        if(this.lastCallGuid==callGuid)
        {
          resolve(response);
        }
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

  public deleteItem(itemId:number):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      var path="/users/DeleteAsync/"+itemId;
      this.restProvider.executeSinovadApiService(HttpMethodType.DELETE,path).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

  public validateConfirmEmailToken(validateConfirmEmailTokenModel:ValidateConfirmEmailTokenModel):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/users/ValidateConfirmEmailToken',validateConfirmEmailTokenModel).then((response: SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

  public recoverPassword(recoverPasswordModel:RecoverPasswordModel):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/users/RecoverPassword',recoverPasswordModel).then((response: SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

  public registerUser(registerUserModel:RegisterUserModel):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/signup/Register',registerUserModel).then((response: SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

  public validateResetPasswordToken(validateResetPasswordTokenModel:ValidateResetPasswordTokenModel):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/users/ValidateResetPasswordToken',validateResetPasswordTokenModel).then((response: SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }

  public resetPassword(resetPasswordModel:ResetPasswordModel):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/users/ResetPassword',resetPasswordModel).then((response: SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        console.error(error);
        reject(error);
      });
   });
  }


}
