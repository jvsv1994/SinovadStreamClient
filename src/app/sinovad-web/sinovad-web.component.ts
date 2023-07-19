
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient } from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { Router } from '@angular/router';
import { RootWebPage } from '../root-web/root-web.page';
@Component({
  selector: 'app-sinovad-web',
  templateUrl: './sinovad-web.component.html',
  styleUrls: ['./sinovad-web.component.scss']
})
export class SinovadWebComponent extends ParentComponent implements OnInit {

  @Output('togglevideo') togglevideo = new EventEmitter();
  @Output('instance') instance = new EventEmitter();
  @ViewChild('mainContainer') mainContainer: ElementRef;
  @ViewChild('initialSound', {static: true}) initialSound: ElementRef;
  intervalAudio:any;
  showRootPage:boolean=false;

  constructor(
    private router: Router,
    public restProvider: RestProviderService,
    public ref: ChangeDetectorRef,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)
    }

    public ngOnInit(): void {
      if((<any>window).configurationData)
      {
        this.sharedData.configurationData=(<any>window).configurationData;
      }
      if(localStorage.getItem('apiKey'))
      {
        this.sharedData.currentToken=localStorage.getItem('apiKey');
        this.getUser().then(res=>{
          this.getMenus();
          this.getProfiles().then(response=>{
            this.showRootPage=true;
            this.ref.detectChanges();
            this.router.navigateByUrl(window.location.pathname+window.location.search).then((result: any) => {

            },error=>{
              this.router.navigateByUrl("/404");
            });
          },error=>{
            console.error(error);
          });
        },error=>{
          console.error(error);
        });
        this.ref.detectChanges();
      }else{
        this.sharedData.currentToken=undefined;
        setTimeout(() => {
          this.showRootPage=true;
          this.ref.detectChanges();
          this.router.navigateByUrl(window.location.pathname).then((result: any) => {

          },error=>{
            this.router.navigateByUrl("/landing");
          });
        }, 100);
      }

      /*
      this.intervalAudio=window.setInterval(function() {
        if(ctx.initialSound && ctx.initialSound.nativeElement.paused)
        {
          ctx.executeAudio();
        }
      }, 1);*/
    }


    public executeAudio(){
      //this.initialSound.nativeElement.play();
    }

    public onEndedAudio(){
      //window.clearInterval(this.intervalAudio);
    }

    public refreshApp(){
     /*  if(this.homePage)
      {
        this.homePage.refresh();
      } */
    }

  ngAfterViewInit(){
    setTimeout(() => {
      this.instance.emit(this);
    }, 250);
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
      }/* else if(this.videoTarget.nativeElement.webkitRequestFullScreen) {
        this.videoTarget.nativeElement.webkitRequestFullScreen();
      } */
      this.mainContainer.nativeElement.click();
      this.ref.detectChanges();
    }
  }

  public executeToggleVideo(show:boolean){
    this.togglevideo.emit(show);
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
    //this.initialSound.nativeElement.pause();
    //this.onEndedAudio();
  }

  public onActivate(event:any)
  {
    let ctx=this;
    if(event instanceof RootWebPage)
    {
      event.toggleVideo.subscribe(event => {
        ctx.executeToggleVideo(event);
      });
    }
  }

}
