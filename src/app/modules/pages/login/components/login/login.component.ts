
import { Component } from '@angular/core';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { User } from '../../../manage/modules/pages/users/models/user.model';
import { MyErrorStateMatcher } from 'src/app/modules/shared/error-matcher/custom-error-state-matcher';
import { ConfirmLinkAccount } from 'src/app/modules/shared/models/confirm-linked-account.model';
import { UserService } from '../../../manage/modules/pages/users/services/user.service';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { MenuService } from '../../../manage/modules/pages/menus/services/menu.service';
import { SignalIRHubService } from 'src/app/modules/shared/services/signal-ir-hub.service';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { AuthenticationUserResponse } from 'src/app/modules/shared/models/authenticate-user-response.model';
import { LinkedAccount } from 'src/app/modules/shared/models/linked-account.model';
import { CatalogEnum, LinkedAccountProvider } from 'src/app/modules/shared/enums/enums';
import { UserSession } from '../../../manage/modules/pages/users/models/user-session.model';


declare var window;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {


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
    public sharedDataService: SharedDataService) {}

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
    this.sharedDataService.apiToken=authenticateUserResponseData.ApiToken;
    localStorage.setItem('apiToken',this.sharedDataService.apiToken);
    let userSessionData:UserSession=authenticateUserResponseData.UserData;
    this.sharedDataService.userData=userSessionData.User;
    this.sharedDataService.mediaServers=userSessionData.MediaServers;
    this.sharedDataService.listProfiles=userSessionData.Profiles;
    this.sharedDataService.linkedAccounts=userSessionData.LinkedAccounts;
    this.sharedDataService.currentProfile=userSessionData.Profiles[0];
    this.sharedDataService.showSplashScreen=true;
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
