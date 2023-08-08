
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from 'src/app/shared/services/shared-data.service';

import { HttpClient } from '@angular/common/http';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { MediaServerService } from '../servers/shared/server.service';
import { ProfileService } from '../profiles/shared/profile.service';
import { UserService } from '../users/shared/user.service';
import { MenuService } from '../menus/shared/menu.service';
@Component({
  selector: 'app-sinovad-web',
  templateUrl: './sinovad-web.component.html',
  styleUrls: ['./sinovad-web.component.scss']
})
export class SinovadWebComponent implements OnInit,OnDestroy {

  intervalCheckMediaServers:any;
  showRootPage:boolean=false;

  constructor(
    private menuService:MenuService,
    private userService:UserService,
    private profileService:ProfileService,
    private serverService: MediaServerService,
    public restProvider: RestProviderService,
    public ref: ChangeDetectorRef,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedService: SharedService) {

    }

    public ngOnInit(): void {
      const queryString = window.location.search;
      if (queryString != "") {
          const urlParams = new URLSearchParams(queryString);
          var apiToken = urlParams.get('apiToken');
          if(apiToken!=null)
          {
            localStorage.setItem('apiToken',apiToken);
          }
      }
      var ctx=this;
      if((<any>window).configurationData)
      {
        this.sharedService.configurationData=(<any>window).configurationData;
      }
      this.intervalCheckMediaServers=window.setInterval(function() {
        //ctx.checkSecureConnectionMediaServers();
      }, 15000);
      if(localStorage.getItem('apiToken'))
      {
        this.sharedService.apiToken=localStorage.getItem('apiToken');
        this.userService.getUser().then(res=>{
          this.menuService.getMenus();
          this.serverService.getMediaServers();
          this.profileService.getAllProfiles().then(response=>{
            this.showRootPage=true;
            this.ref.detectChanges();

          },error=>{
            console.error(error);
          });
        },error=>{
          console.error(error);
        });
        this.ref.detectChanges();
      }else{
        this.sharedService.apiToken=undefined;
        setTimeout(() => {
          this.showRootPage=true;
          this.ref.detectChanges();

        }, 100);
      }
    }

    public ngOnDestroy(): void {
      if(this.intervalCheckMediaServers)
      {
        window.clearInterval(this.intervalCheckMediaServers);
      }
    }

    ngAfterViewInit(){
      let ctx=this;
      let customClickEvent=function onCustomClick(event:any) {
        if(ctx.sharedService.configurationData.alwaysFullScreen)
        {
          ctx.showPageInFullScreen();
        }
      }
      window.addEventListener('click',customClickEvent);
    }

    public showPageInFullScreen(){
      if(!document.fullscreenElement)
      {
        if (document.body.requestFullscreen) {
          document.body.requestFullscreen();
        }
      }
    }

    public onActivate(event:any)
    {

    }

}
