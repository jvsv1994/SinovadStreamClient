import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthProvider, FacebookAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { RestProviderService } from './rest-provider.service';
import { HttpMethodType } from '../enums';
import { SinovadApiGenericResponse } from '../models/response/sinovad-api-generic-response.model';
import { User } from 'src/app/users/shared/user.model';
import { LinkedAccount } from '../models/linked-account.model';
import { ConfirmLinkAccount } from '../models/confirm-linked-account.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private restProvider:RestProviderService,
    private afAuth: AngularFireAuth
    ) { }

  public validateUser(username:string):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve,reject)=>{
      this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/authentication/ValidateUser',{UserName:username}).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        reject(error)
      });
    })
  }

  public authenticateByLinkedAccount(linkedAccount:LinkedAccount):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve,reject)=>{
      this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/authentication/AuthenticateLinkedAccount',linkedAccount).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        reject(error)
      });
    })
  }

  public authenticateUser(user:User):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve,reject)=>{
      this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/users/Login',user).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        reject(error)
      });
    })
  }


  public authenticatePasswordAndConfirmLinkAccountToUser(confirmLinkAccount:ConfirmLinkAccount):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve,reject)=>{
      this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/authentication/AuthenticatePasswordAndConfirmLinkAccountToUser',confirmLinkAccount).then((response:SinovadApiGenericResponse) => {
        resolve(response);
      },error=>{
        reject(error)
      });
    })
  }


  public authenticateWithGoogle():Promise<any> {
    return this.authenticate(new GoogleAuthProvider());
  }

  public authenticateWithFacebook():Promise<any> {
    return this.authenticate(new FacebookAuthProvider());
  }

  public authenticateWithApple() {

  }

  private authenticate(provider:AuthProvider):Promise<any> {
    return new Promise((resolve, reject) => {
      return this.afAuth.signInWithPopup(provider).then((result) => {
        resolve(result);
      }).catch((error) => {
        reject(error);
      });
    });
  }

}
