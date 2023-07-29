
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient } from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { WebContainerPage } from '../web-container/web-container.page';
@Component({
  selector: 'app-sinovad-web',
  templateUrl: './sinovad-web.component.html',
  styleUrls: ['./sinovad-web.component.scss']
})
export class SinovadWebComponent extends ParentComponent implements OnInit,OnDestroy {

  @ViewChild('mainContainer') mainContainer: ElementRef;
  @ViewChild('initialSound', {static: true}) initialSound: ElementRef;
  intervalCheckMediaServers:any;
  showRootPage:boolean=false;

  constructor(
    public restProvider: RestProviderService,
    public ref: ChangeDetectorRef,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)
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
        this.sharedData.configurationData=(<any>window).configurationData;
      }
      this.intervalCheckMediaServers=window.setInterval(function() {
        ctx.checkSecureConnectionMediaServers();
      }, 15000);
      if(localStorage.getItem('apiToken'))
      {
        this.sharedData.apiToken=localStorage.getItem('apiToken');
        this.getUser().then(res=>{
          this.getMenus();
          this.getMediaServers();
          this.getProfiles().then(response=>{
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
        this.sharedData.apiToken=undefined;
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
        if(ctx.sharedData.configurationData.alwaysFullScreen)
        {
          ctx.showPageInFullScreen();
        }
      }
      window.addEventListener('click',customClickEvent);
    }

    public showPageInFullScreen(){
      if(!document.fullscreenElement)
      {
        var vidContainer:any =  this.mainContainer.nativeElement;
        if (vidContainer.requestFullScreen) {
          vidContainer.requestFullScreen();
        }else if (vidContainer.webkitRequestFullScreen) {
          vidContainer.webkitRequestFullScreen();
        }else{
          vidContainer.mozRequestFullScreen();
        }
        this.mainContainer.nativeElement.click();
        this.ref.detectChanges();
      }
    }

    public executeToggleVideo(show:boolean){
      if(show)
      {
        this.showPageInFullScreen();
      }else{
        if(!this.sharedData.configurationData.alwaysFullScreen)
        {
          if (document.fullscreenElement) {
            document.exitFullscreen();
          }
        }
      }
    }

    public onActivate(event:any)
    {
      let ctx=this;
      if(event instanceof WebContainerPage)
      {
        event.toggleVideo.subscribe(event => {
          ctx.executeToggleVideo(event);
        });
      }
    }

}
