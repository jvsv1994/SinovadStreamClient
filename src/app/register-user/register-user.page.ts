
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient } from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { HttpMethodType } from '../enums';
import { RegisterUserModel } from '../../models/registerUserModel';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

declare var window;
@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.page.html',
  styleUrls: ['./register-user.page.scss']
})
export class RegisterUserPage extends ParentComponent implements OnInit {

  _window=window;
  title: string;
  errorMessage: string;
  showLoading:boolean=false;
  showSuccessMessage:boolean=false;
  customKeyboardControlsEvent:any;
  registerUserModel:RegisterUserModel=new RegisterUserModel();
  registerUserForm = this.formBuilder.group({
    email: new FormControl("", [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    firstName: new FormControl("", [Validators.required]),
    lastName: new FormControl("", [Validators.required]),
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
    confirmPassword: new FormControl("", [Validators.required])
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

    ngOnInit(): void {
      if(localStorage.getItem('apiToken'))
      {
        this.router.navigate(['home'],{ skipLocationChange: false});
      }
    }

    public register(){
      if(this.registerUserForm.valid)
      {
        this.registerUserModel={
          Email:this.registerUserForm.value.email,
          FirstName:this.registerUserForm.value.firstName,
          LastName:this.registerUserForm.value.lastName,
          UserName:this.registerUserForm.value.username,
          Password:this.registerUserForm.value.password,
          ConfirmPassword:this.registerUserForm.value.confirmPassword,
          ConfirmEmailUrl:window.location.origin+"/confirm"
        }
        this.showLoading=true;
        this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/users/Register',this.registerUserModel).then((response: any) => {
          console.log("Registrado exitosamente");
          this.showLoading=false;
          this.showSuccessMessage=true;
        },error=>{
          this.showLoading=false;
          this.errorMessage=error;
          console.error(error);
        });
      }else{
        this.errorMessage=undefined;
        this.registerUserForm.markAllAsTouched();
      }
    }

    public onClose(){
      this.router.navigate(['landing'],{ skipLocationChange: false});
    }

}
