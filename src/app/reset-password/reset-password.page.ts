
import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { HttpMethodType } from 'src/app/shared/enums';
import { ActivatedRoute, Router } from '@angular/router';
import hiBase64 from 'hi-base64';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ResetPasswordModel } from './reset-password.model';
import { ValidateResetPasswordTokenModel } from './validate-reset-password-token.model';

declare var window;
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss']
})
export class ResetPasswordPage implements OnInit {

  _window=window;
  title: string;
  errorMessage: string;
  showLoading:boolean=false;
  customKeyboardControlsEvent:any;
  resetPasswordModel:ResetPasswordModel=new ResetPasswordModel();
  showResetPasswordForm:boolean=false;
  showInvalidTokenMessage:boolean=false;
  showResetPasswordSuccessMessage:boolean=false;
  resetPasswordToken:string;
  userId:string;
  resetPasswordForm = this.formBuilder.group({
    password: new FormControl("", [Validators.required]),
    confirmPassword: new FormControl("", [Validators.required])
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public activeRoute: ActivatedRoute,
    public restProvider: RestProviderService,
    public sharedService: SharedService) {

    }

  ngOnInit(): void {
    if(localStorage.getItem('apiToken'))
    {
      this.router.navigate(['home'],{ skipLocationChange: false});
    }
    let base64Data = this.activeRoute.snapshot.params.base64Data;
    if(base64Data!=null)
    {
      try{
        let result = hiBase64.decode(base64Data);
        var additionalUrlData =JSON.parse(result);
        this.resetPasswordToken=additionalUrlData.ResetPasswordToken;
        this.userId=additionalUrlData.UserId;
        if(this.resetPasswordToken!=undefined && this.userId!=undefined)
        {
          this.showLoading=true;
          var validateResetPasswordTokenModel= new ValidateResetPasswordTokenModel();
          validateResetPasswordTokenModel.ResetPasswordToken=this.resetPasswordToken;
          validateResetPasswordTokenModel.UserId=this.userId;;
          this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/users/ValidateResetPasswordToken',validateResetPasswordTokenModel).then((result: any) => {
            this.showResetPasswordForm=true;
            this.showLoading=false;
          },error=>{
            this.showLoading=false;
            this.showInvalidTokenMessage=true;
            this.errorMessage=error;
            console.error(error);
          });
        }else{
          this.showInvalidTokenMessage=true;
        }
      }catch(e){
        this.showInvalidTokenMessage=true;
      }
    }else{
      this.router.navigate(['home'],{ skipLocationChange: false});
    }
  }

  public confirm(){
    if(this.resetPasswordForm.valid)
    {
      this.showLoading=true;
      this.resetPasswordModel={
        ResetPasswordToken:this.resetPasswordToken,
        UserId:this.userId,
        Password:this.resetPasswordForm.value.password,
        ConfirmPassword:this.resetPasswordForm.value.confirmPassword
      }
      this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/users/ResetPassword',this.resetPasswordModel).then((result: any) => {
        this.showResetPasswordSuccessMessage=true;
        this.showResetPasswordForm=false;
        this.showLoading=false;
      },error=>{
        this.showLoading=false;
        this.errorMessage=error;
        console.error(error);
      });
    }else{
      this.errorMessage=undefined;
      this.resetPasswordForm.markAllAsTouched();
    }
  }

  public onClickCloseButton(){
    this.router.navigate(['login'],{ skipLocationChange: false});
  }

}
