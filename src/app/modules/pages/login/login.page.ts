
import { Component } from '@angular/core';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfirmLinkAccount } from '../../shared/models/confirm-linked-account.model';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { SinovadApiGenericResponse } from '../../shared/models/response/sinovad-api-generic-response.model';
import { AuthenticationUserResponse } from '../../shared/models/authenticate-user-response.model';
import { LinkedAccount } from '../../shared/models/linked-account.model';
import { CatalogEnum, LinkedAccountProvider } from '../../shared/enums/enums';
import { MyErrorStateMatcher } from '../../shared/error-matcher/custom-error-state-matcher';
import { SignalIRHubService } from '../../shared/services/signal-ir-hub.service';
import { User } from '../manage/modules/pages/users/models/user.model';
import { MenuService } from '../manage/modules/pages/menus/services/menu.service';
import { UserService } from '../manage/modules/pages/users/services/user.service';
import { UserSession } from '../manage/modules/pages/users/models/user-session.model';

declare var window;
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {


  _window=window;
  title: string;
  errorMessage: string;
  showLoading:boolean=false;
  user:User=new User();
  userFormGroup = this.formBuilder.group({
    username: new FormControl("", [Validators.required]),
  });
  passwordFormGroup = this.formBuilder.group({
    password: new FormControl("", [Validators.required])
  });
  matcher = new MyErrorStateMatcher();
  showPasswordForm:boolean=false;
  showConfirmLinkedAccountForm:boolean=false;
  confirmLinkAccountData:ConfirmLinkAccount;

  constructor(
    private userService:UserService,
    private authenticationService:AuthenticationService,
    private menuService:MenuService,
    private signalIRHubService:SignalIRHubService,
    private formBuilder: FormBuilder,
    private router: Router,
    public sharedService: SharedDataService) {}

    public validateUser(){
      if(this.userFormGroup.valid)
      {
        this.showLoading=true;
        this.user.UserName=this.userFormGroup.value.username;
        this.authenticationService.validateUser(this.user.UserName).then((response:SinovadApiGenericResponse) => {
          this.showPasswordForm=true;
          this.showLoading=false;
          this.errorMessage=undefined;
        },error=>{
          this.showLoading=false;
          this.errorMessage=error;
          console.error(error);
        });
      }else{
        this.errorMessage=undefined;
        this.userFormGroup.markAllAsTouched();
      }
    }

    public authenticateUser(){
      if(this.passwordFormGroup.valid)
      {
        this.user.Password=this.passwordFormGroup.value.password;
        this.showLoading=true;
        this.authenticationService.authenticateUser(this.user).then((response:SinovadApiGenericResponse) => {
          var authenticateUserResponseData:AuthenticationUserResponse=response.Data;
          this.setUserSessionDataAfterAuthenticate(authenticateUserResponseData);
        },error=>{
          this.showLoading=false;
          this.errorMessage=error;
          console.error(error);
        });
      }else{
        this.errorMessage=undefined;
        this.passwordFormGroup.markAllAsTouched();
      }
    }

  public loginWithGoogle(){
    this.showLoading=true;
    this.errorMessage=undefined;
    this.authenticationService.authenticateWithGoogle().then(response=>{
      var linkedAccount=new LinkedAccount();
      linkedAccount.AccessToken=response.credential.accessToken;
      linkedAccount.LinkedAccountProviderCatalogId=CatalogEnum.LinkedAccountProvider;
      linkedAccount.LinkedAccountProviderCatalogDetailId=LinkedAccountProvider.Google;
      this.authenticationService.authenticateByLinkedAccount(linkedAccount).then((response:SinovadApiGenericResponse)=>{
        var authenticateUserResponseData:AuthenticationUserResponse=response.Data;
        if(authenticateUserResponseData.ConfirmLinkAccountData)
        {
          this.showLoading=false;
          this.confirmLinkAccountData=authenticateUserResponseData.ConfirmLinkAccountData;
          this.showConfirmLinkedAccountForm=true;
        }else{
          this.setUserSessionDataAfterAuthenticate(authenticateUserResponseData);
        }
      },error=>{
        this.showLoading=false;
      })
    },error=>{
      console.error(error);
      this.showLoading=false;
    })
  }

  public ConfirmLinkAccountToUser(){
    this.errorMessage=undefined;
    if(this.passwordFormGroup.valid)
    {
      this.confirmLinkAccountData.Password=this.passwordFormGroup.value.password;
      this.showLoading=true;
      this.authenticationService.authenticatePasswordAndConfirmLinkAccountToUser(this.confirmLinkAccountData).then((response:SinovadApiGenericResponse) => {
        var authenticateUserResponseData:AuthenticationUserResponse=response.Data;
        this.setUserSessionDataAfterAuthenticate(authenticateUserResponseData);
      },error=>{
        this.showLoading=false;
        this.errorMessage=error;
        console.error(error);
      });
    }else{
      this.errorMessage=undefined;
      this.passwordFormGroup.markAllAsTouched();
    }
  }

  private setUserSessionDataAfterAuthenticate(authenticateUserResponseData:AuthenticationUserResponse){
    this.sharedService.apiToken=authenticateUserResponseData.ApiToken;
    localStorage.setItem('apiToken',this.sharedService.apiToken);
    let userSessionData:UserSession=authenticateUserResponseData.UserData;
    this.sharedService.userData=userSessionData.User;
    this.sharedService.mediaServers=userSessionData.MediaServers;
    this.sharedService.listProfiles=userSessionData.Profiles;
    this.sharedService.linkedAccounts=userSessionData.LinkedAccounts;
    this.sharedService.currentProfile=userSessionData.Profiles[0];
    this.sharedService.showSplashScreen=true;
    this.userService.calledGetUserData=true;
    this.menuService.getManageMenu();
    this.signalIRHubService.openConnection();
    this.router.navigate(['profiles'],{ skipLocationChange: false});
  }

  public loginWithFacebook(){
    this.showLoading=true;
    this.authenticationService.authenticateWithFacebook().then(response=>{
      console.log(response);
      this.showLoading=false;
    },error=>{
      console.error(error);
      this.showLoading=false;
    })
  }

  public loginWithApple(){

  }

  public onClose(){
    this.router.navigateByUrl('/landing');
  }

  public showRecoverPasswordPage(){
    this.router.navigateByUrl('/recover');
  }


}
