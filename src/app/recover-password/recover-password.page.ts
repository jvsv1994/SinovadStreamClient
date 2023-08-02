
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient } from '@angular/common/http';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { HttpMethodType } from 'src/app/shared/enums';
import { RecoverPasswordModel } from '../../models/recoverPasswordModel';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

declare var window;
@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.page.html',
  styleUrls: ['./recover-password.page.scss']
})
export class RecoverPasswordPage extends ParentComponent implements OnInit {

  _window=window;
  title: string;
  errorMessage: string;
  showLoading:boolean=false;
  customKeyboardControlsEvent:any;
  recoverPasswordModel=new RecoverPasswordModel();
  sendedConfirmationEmail:boolean=false;
  recoverPasswordForm = this.formBuilder.group({
    email: new FormControl("", [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
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

  public SendRecoverPasswordEmail(){
    if(this.recoverPasswordForm.valid)
    {
      this.recoverPasswordModel={
        Email:this.recoverPasswordForm.value.email,
        ResetPasswordUrl:window.location.origin+"/reset"
      }
      this.showLoading=true;
      this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/users/RecoverPassword',this.recoverPasswordModel).then((result: any) => {
        this.sendedConfirmationEmail=true;
        this.showLoading=false;
      },error=>{
        this.showLoading=false;
        this.errorMessage=error;
        console.error(error);
      });
    }else{
      this.errorMessage=undefined;
      this.recoverPasswordForm.markAllAsTouched();
    }
  }

  public onClose(){
    this.router.navigate(['landing'],{ skipLocationChange: false});
  }

}
