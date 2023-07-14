
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient } from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { HttpMethodType } from '../enums';
import { ResetPasswordModel } from '../../models/resetPasswordModel';
import { ValidateResetPasswordTokenModel } from '../../models/validateResetPasswordTokenModel';
import { ActivatedRoute, Router } from '@angular/router';
import hiBase64 from 'hi-base64';

declare var window;
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss']
})
export class ResetPasswordPage extends ParentComponent implements OnInit {

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

  constructor(
    private router: Router,
    public activeRoute: ActivatedRoute,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

  ngOnInit(): void {
    if(localStorage.getItem('apiKey'))
    {
      this.router.navigate([this.sharedData.platform,'home'],{ skipLocationChange: false});
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
          this.router.navigate([this.sharedData.platform,'home'],{ skipLocationChange: false});
        }
      }catch(e){
        this.router.navigate([this.sharedData.platform,'home'],{ skipLocationChange: false});
      }
    }else{
      this.router.navigate([this.sharedData.platform,'home'],{ skipLocationChange: false});
    }
  }

  public confirm(){
    this.showLoading=true;
    this.resetPasswordModel.ResetPasswordToken=this.resetPasswordToken;
    this.resetPasswordModel.UserId=this.userId;
    this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/users/ResetPassword',this.resetPasswordModel).then((result: any) => {
      this.showResetPasswordSuccessMessage=true;
      this.showResetPasswordForm=false;
      this.showLoading=false;
    },error=>{
      this.showLoading=false;
      this.errorMessage=error;
      console.error(error);
    });
  }

  public onClickCloseButton(){
    this.router.navigate([this.sharedData.platform,'login'],{ skipLocationChange: false});
  }

}
