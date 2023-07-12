
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { RestProviderService } from 'src/services/rest-provider.service';
import { HttpMethodType } from '../Enums';
import { SinovadApiGenericResponse } from '../response/sinovadApiGenericResponse';
import { Router } from '@angular/router';

declare var window;
@Component({
  selector: 'app-login-tv',
  templateUrl: './login-tv.page.html',
  styleUrls: ['./login-tv.page.scss']
})
export class LoginTvPage extends ParentComponent implements OnInit {


  _window=window;
  title: string;
  errorMessage: string;
  showLoading:boolean=false;
  @ViewChild('loginFormContainer') loginFormContainer: ElementRef;
  customKeyboardControlsEvent:any;
  account:User=new User();

  constructor(
    private router: Router,
    public restProvider: RestProviderService,
    private  ref:ChangeDetectorRef,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

  ngOnInit(): void {

  }

  ngOnDestroy(){
    this.loginFormContainer.nativeElement.removeEventListener('keydown',this.customKeyboardControlsEvent);
  }

  ngAfterViewInit(){
    this.initializeLoginViewControls();
  }

  public initializeLoginViewControls(){
    if(this.customKeyboardControlsEvent)
    {
      this.loginFormContainer.nativeElement.removeEventListener('keydown',this.customKeyboardControlsEvent);
    }
    this.focusFullScreenContainer(this.loginFormContainer.nativeElement,this.ref);
    let ctx=this;
    this.customKeyboardControlsEvent=function onCustomKeyboardDown(event:any) {
      ctx.setKeyboardActionsFullScreenPage(event,ctx.loginFormContainer.nativeElement,ctx.ref);
    }
    this.loginFormContainer.nativeElement.addEventListener('keydown',this.customKeyboardControlsEvent);
  }

  public login(){
    this.showLoading=true;
    this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/accounts/Login',this.account).then((response:SinovadApiGenericResponse) => {
      let token=response.Data;
      localStorage.setItem('apiKey',token);
      this.router.navigate([{ outlets: { rostp: ['maintv'] } }],{ skipLocationChange: false});
    },error=>{
      this.showLoading=false;
      this.errorMessage=error;
      console.error(error);
    });
  }

}
