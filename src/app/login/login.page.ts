
import { Component } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { User } from '../users/shared/user.model';
import { MediaServerService } from '../servers/shared/server.service';
import { ProfileService } from '../profiles/shared/profile.service';
import { UserService } from '../users/shared/user.service';
import { MenuService } from '../menus/shared/menu.service';
import { SinovadApiGenericResponse } from '../shared/models/response/sinovad-api-generic-response.model';
import { MyErrorStateMatcher } from '../shared/custom-error-state-matcher';
import { AuthenticationService } from '../shared/services/authentication.service';

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

  constructor(
    private authenticationService:AuthenticationService,
    private menuService:MenuService,
    private userService:UserService,
    private profileService: ProfileService,
    private serverService: MediaServerService,
    private formBuilder: FormBuilder,
    private router: Router,
    public sharedService: SharedService) {}

    public validateUser(){
      if(this.userFormGroup.valid)
      {
        this.showLoading=true;
        this.user.UserName=this.userFormGroup.value.username;
        this.authenticationService.validateUser(this.user.UserName).then((response:SinovadApiGenericResponse) => {
          this.showPasswordForm=true;
          this.showLoading=false;
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

    public ValidatePassword(){
      if(this.passwordFormGroup.valid)
      {
        this.user.Password=this.passwordFormGroup.value.password;
        this.showLoading=true;
        this.authenticationService.authenticateUser(this.user).then((response:SinovadApiGenericResponse) => {
          let token=response.Data;
          localStorage.setItem('apiToken',token);
          this.sharedService.apiToken=token;
          this.sharedService.showSplashScreen=true;
          this.userService.getUser().then(res=>{
            this.menuService.getManageMenu();
            this.serverService.getMediaServers();
            this.profileService.getAllProfiles().then(res=>{
              this.router.navigate(['select-profile'],{ skipLocationChange: false});
            },error=>{
              console.error(error);
            });
          },error=>{
            console.error(error);
          });
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
    this.authenticationService.authenticateWithGoogle().then(response=>{
      console.log(response);
      this.showLoading=false;
    },error=>{
      console.error(error);
      this.showLoading=false;
    })
  }

  public loginWithFacebook(){
    /*
    this.showLoading=true;
    this.authenticationService.authenticateWithFacebook().then(response=>{
      console.log(response);
      this.showLoading=false;
    },error=>{
      console.error(error);
      this.showLoading=false;
    })*/
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
