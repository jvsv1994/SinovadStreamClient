
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { HttpMethodType } from 'src/app/shared/enums';
import { SinovadApiGenericResponse } from '../response/sinovadApiGenericResponse';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { User } from '../users/shared/user.model';
import { MediaServerService } from '../servers/shared/server.service';
import { ProfileService } from '../profiles/shared/profile.service';
import { UserService } from '../users/shared/user.service';
import { MenuService } from '../menus/shared/menu.service';
import { LibraryService } from '../libraries/shared/library.service';

declare var window;
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {


  _window=window;
  title: string;
  errorMessage: string;
  showLoading:boolean=false;
  user:User=new User();
  loginForm = this.formBuilder.group({
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required])
  });

  constructor(
    private libraryService:LibraryService,
    private menuService:MenuService,
    private userService:UserService,
    private profileService: ProfileService,
    private serverService: MediaServerService,
    private formBuilder: FormBuilder,
    private router: Router,
    public restProvider: RestProviderService,
    public sharedService: SharedService) {


    }

  ngOnInit(): void {
    if(localStorage.getItem('apiToken'))
    {
      this.router.navigateByUrl('/home');
    }
  }

  ngOnDestroy(){
  }

  ngAfterViewInit(){
    this.initializeLoginViewControls();
  }

  public initializeLoginViewControls(){

  }

  public login(){
    if(this.loginForm.valid)
    {
      this.user={
        UserName:this.loginForm.value.username,
        Password:this.loginForm.value.password
      }
      this.showLoading=true;
      this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/users/Login',this.user).then((response:SinovadApiGenericResponse) => {
        let token=response.Data;
        localStorage.setItem('apiToken',token);
        this.sharedService.apiToken=token;
        this.sharedService.showSplashScreen=true;
        this.userService.getUser().then(res=>{
          this.menuService.getManageMenu();
          //this.menuService.getMediaMenu();
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
      this.loginForm.markAllAsTouched();
    }
  }

  public onClose(){
    this.router.navigateByUrl('/landing');
  }

  public showRecoverPasswordPage(){
    this.router.navigateByUrl('/recover');
  }

}
