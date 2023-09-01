
import { Component, OnInit } from '@angular/core';
import { RestProviderService } from 'src/app/modules/shared/services/rest-provider.service';
import { HttpMethodType } from 'src/app/modules/shared/enums/enums';
import { ActivatedRoute, Router } from '@angular/router';
import hiBase64 from 'hi-base64';
import { ValidateConfirmEmailTokenModel } from './validate-confirm-email-token.model';

declare var window;
@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.page.html',
  styleUrls: ['./confirm-email.page.scss']
})
export class ConfirmEmailPage implements OnInit {

  _window=window;
  title: string;
  errorMessage: string;
  showLoading:boolean=false;
  customKeyboardControlsEvent:any;
  showInvalidTokenMessage:boolean=false;
  showSuccessMessage:boolean=false;

  constructor(
    private router: Router,
    public activeRoute: ActivatedRoute,
    public restProvider: RestProviderService) {

    }

  ngOnInit(): void {
    let base64Data = this.activeRoute.snapshot.params.base64Data;
    if(base64Data!=null)
    {
      try{
        let result = hiBase64.decode(base64Data);
        var additionalUrlData =JSON.parse(result);
        if(additionalUrlData.ConfirmEmailToken)
        {
          this.showLoading=true;
          var validateConfirmEmailTokenModel= new ValidateConfirmEmailTokenModel();
          validateConfirmEmailTokenModel.ConfirmEmailToken=additionalUrlData.ConfirmEmailToken;
          validateConfirmEmailTokenModel.UserId=additionalUrlData.UserId;;
          this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/users/ValidateConfirmEmailToken',validateConfirmEmailTokenModel).then((result: any) => {
            this.showLoading=false;
            this.showSuccessMessage=true;
          },error=>{
            this.showLoading=false;
            this.showInvalidTokenMessage=true;
            this.errorMessage=error;
            console.error(error);
          });
        }else{
          this.router.navigate(['home'],{ skipLocationChange: false});
        }
      }catch(e){
        this.router.navigate(['home'],{ skipLocationChange: false});
      }
    }else{
      this.router.navigate(['home'],{ skipLocationChange: false});
    }
  }

  public onClose(){
    this.router.navigate(['login'],{ skipLocationChange: false});
  }

}