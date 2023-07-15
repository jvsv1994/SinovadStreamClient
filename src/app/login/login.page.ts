
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user';
import { RestProviderService } from 'src/services/rest-provider.service';
import { HttpMethodType } from '../enums';
import { SinovadApiGenericResponse } from '../response/sinovadApiGenericResponse';
import { Router } from '@angular/router';

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
  @ViewChild('loginFormContainer') loginFormContainer: ElementRef;
  customKeyboardControlsEvent:any;
  user:User=new User();
  @Output() showSplashScreen =new EventEmitter();

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
    if(localStorage.getItem('apiKey'))
    {
      this.router.navigateByUrl("/"+this.sharedData.platform+'/home');
    }
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
    this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/users/Login',this.user).then((response:SinovadApiGenericResponse) => {
      let token=response.Data;
      localStorage.setItem('apiKey',token);
      this.sharedData.currentToken=token;
      this.showSplashScreen.emit(true);
      this.getUser().then(res=>{
        this.getMenus();
        this.getProfiles().then(res=>{
          this.router.navigate([this.sharedData.platform,'select-profile'],{ skipLocationChange: false});
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
  }

  public onClose(){
    this.router.navigateByUrl("/"+this.sharedData.platform+'/landing');
  }

  public showRecoverPasswordPage(){
    this.router.navigateByUrl("/"+this.sharedData.platform+'/recover');
  }

}
