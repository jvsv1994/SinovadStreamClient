
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user';
import { RestProviderService } from 'src/services/rest-provider.service';
import { HttpMethodType } from '../enums';
import { SinovadApiGenericResponse } from '../response/sinovadApiGenericResponse';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

declare var window;
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage extends ParentComponent implements OnInit {


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
    private formBuilder: FormBuilder,
    private router: Router,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)

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
        this.sharedData.apiToken=token;
        this.sharedData.showSplashScreen=true;
        this.getUser().then(res=>{
          this.getMenus();
          this.getMediaServers();
          this.getProfiles().then(res=>{
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
