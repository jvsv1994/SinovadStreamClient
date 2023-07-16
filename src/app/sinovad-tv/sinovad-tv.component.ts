
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient } from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MainTvPage } from '../main-tv/main-tv.page';
@Component({
  selector: 'app-sinovad-tv',
  templateUrl: './sinovad-tv.component.html',
  styleUrls: ['./sinovad-tv.component.scss']
})
export class SinovadTvComponent extends ParentComponent implements OnInit {

  @ViewChild('mainContainer') mainContainer: ElementRef;

  constructor(
    private route:ActivatedRoute,
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
      this.sharedData.platform='tv';
      if(localStorage.getItem('apiKey'))
      {
        this.router.navigate([{ outlets: { rostp: ['maintv'] } }],{ relativeTo: this.route, skipLocationChange: true});
      }else{
        this.router.navigate([{ outlets: { rostp: ['logintv'] } }],{ relativeTo: this.route, skipLocationChange: true});
      }
    }

    public onActivate(event:any){
      let ctx=this;
      if(event instanceof MainTvPage)
      {
        event.fullScreen.subscribe(event => {
          ctx.showPageInFullScreen();
        });
      }
    }

    public showPageInFullScreen(){
      if(!document.fullscreenElement)
      {
        var mainContainer:any =  this.mainContainer.nativeElement;
        if (mainContainer.requestFullScreen) {
          mainContainer.requestFullScreen();
        }else if (mainContainer.webkitRequestFullScreen) {
          mainContainer.webkitRequestFullScreen();
        }else if(mainContainer.mozRequestFullScreen){
          mainContainer.mozRequestFullScreen();
        }
      }
    }

  ngAfterViewInit(){
    let ctx=this;
    let customClickEvent=function onCustomClick(event:any) {
      ctx.showPageInFullScreen();
    }
    window.addEventListener('click',customClickEvent);
  }

}
