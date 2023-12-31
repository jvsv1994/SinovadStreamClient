import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthProvider, FacebookAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { HttpMethodType } from 'src/app/modules/shared/enums/enums';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { RestProviderService } from 'src/app/services/rest-provider.service';
import { AccessUser } from '../models/access-user.model';
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

  public validateUser(username:string):Promise<any>{
    return new Promise((resolve,reject)=>{
      this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/authentication/ValidateUser',{UserName:username}).then((response) => {
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

  public authenticateUser(user:AccessUser):Promise<SinovadApiGenericResponse>{
    return new Promise((resolve,reject)=>{
      this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/authentication/AuthenticateUser',user).then((response:SinovadApiGenericResponse) => {
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
