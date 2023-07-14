
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient } from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { HttpMethodType } from '../enums';
import { RecoverPasswordModel } from '../../models/recoverPasswordModel';
import { Router } from '@angular/router';

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
  @ViewChild('recoverPasswordFormContainer') recoverPasswordFormContainer: ElementRef;
  customKeyboardControlsEvent:any;
  recoverPasswordModel=new RecoverPasswordModel();
  sendedConfirmationEmail:boolean=false;

  constructor(
    private router: Router,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

  public SendRecoverPasswordEmail(){
    this.showLoading=true;
    this.recoverPasswordModel.ResetPasswordUrl=window.location.origin+"/"+this.sharedData.platform+"/reset";
    this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/users/RecoverPassword',this.recoverPasswordModel).then((result: any) => {
      this.sendedConfirmationEmail=true;
      this.showLoading=false;
    },error=>{
      this.showLoading=false;
      this.errorMessage=error;
      console.error(error);
    });
  }

  public onClose(){
    this.router.navigate([this.sharedData.platform,'landing'],{ skipLocationChange: false});
  }

}
