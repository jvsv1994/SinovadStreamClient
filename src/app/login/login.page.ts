
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
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
      this.router.navigateByUrl('/home');
    }
  }

  ngOnDestroy(){
  }

  ngAfterViewInit(){
    this.initializeLoginViewControls();
  }

  public initializeLoginViewControls(){

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
        this.getMediaServers();
        this.getProfiles().then(res=>{
          this.router.navigate(['select-profile'],{ skipLocationChange: false});
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
    this.router.navigateByUrl('/landing');
  }

  public showRecoverPasswordPage(){
    this.router.navigateByUrl('/recover');
  }

}
