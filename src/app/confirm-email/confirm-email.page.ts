
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient } from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { HttpMethodType } from '../Enums';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidateConfirmEmailTokenModel } from '../models/validateConfirmEmailTokenModel';
import hiBase64 from 'hi-base64';

declare var window;
@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.page.html',
  styleUrls: ['./confirm-email.page.scss']
})
export class ConfirmEmailPage extends ParentComponent implements OnInit {

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
        if(additionalUrlData.ConfirmEmailToken)
        {
          this.showLoading=true;
          var validateConfirmEmailTokenModel= new ValidateConfirmEmailTokenModel();
          validateConfirmEmailTokenModel.ConfirmEmailToken=additionalUrlData.ConfirmEmailToken;
          validateConfirmEmailTokenModel.UserId=additionalUrlData.UserId;;
          this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/accounts/ValidateConfirmEmailToken',validateConfirmEmailTokenModel).then((result: any) => {
            this.showLoading=false;
            this.showSuccessMessage=true;
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

  public onClose(){
    this.router.navigate([this.sharedData.platform,'login'],{ skipLocationChange: false});
  }

}
