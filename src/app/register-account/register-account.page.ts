
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient } from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { HttpMethodType } from '../Enums';
import { RegisterUserModel } from '../models/registerUserModel';
import { Router } from '@angular/router';

declare var window;
@Component({
  selector: 'app-register-account',
  templateUrl: './register-account.page.html',
  styleUrls: ['./register-account.page.scss']
})
export class RegisterAccountPage extends ParentComponent implements OnInit {

  _window=window;
  title: string;
  errorMessage: string;
  showLoading:boolean=false;
  showSuccessMessage:boolean=false;
  customKeyboardControlsEvent:any;
  registerUserModel:RegisterUserModel=new RegisterUserModel();

  constructor(
    private router: Router,
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
    }

    public register(){
      this.registerUserModel.ConfirmEmailUrl=window.location.origin+"/"+this.sharedData.platform+"/confirm";
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
    }

    public onClose(){
      this.router.navigate([this.sharedData.platform,'landing'],{ skipLocationChange: false});
    }

}
