import { ChangeDetectorRef, Component } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { MediaServer } from 'src/app/modules/pages/manage/modules/pages/servers/models/server.model';
import { Subscription } from 'rxjs';
import { SignalIRHubService } from 'src/app/services/signal-ir-hub.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaFilePlayback } from 'src/app/modules/pages/media-video/models/media-file-playback.model';
import { MediaFilePlaybackClient } from 'src/app/modules/pages/media-video/models/media-file-playback-client.model';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent {
  mediaServer:MediaServer;
  loadingConnection:boolean=true;
  subscriptionEnableMediaServer:Subscription;
  subscriptionDisableMediaServer:Subscription;
  subscriptionUpdateCurrentTimeMediaFilePlayback:Subscription;
  subscriptionAddedMediaFilePlayback:Subscription;
  subscriptionRemovedMediaFilePlayback:Subscription;
  listItems:MediaFilePlayback[];

  constructor(
    public commonService: CommonService,
    public sharedDataService: SharedDataService,
    private ref:ChangeDetectorRef,
    private router: Router,
    public activeRoute: ActivatedRoute,
    private signalIrService:SignalIRHubService,
    private dashboardService:DashboardService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.subscriptionAddedMediaFilePlayback=this.signalIrService.isAddedMediaFilePlayback().subscribe((event:any) => {
      if(this.mediaServer && this.mediaServer.Guid==event.mediaServerGuid)
      {
        var item=this.listItems.find(x=>x.Guid==event.mediaFilePlaybackGuid);
        if(item==undefined)
        {
          this.dashboardService.GetListMediaFilePlayback(this.mediaServer.Url).then((list:MediaFilePlayback[]) => {
            var newItem=list.find(x=>x.Guid==event.mediaFilePlaybackGuid);
            if(newItem)
            {
              this.listItems.push(newItem);
              this.ref.detectChanges();
            }
          },error=>{

          });
        }
      }
    });
    this.subscriptionRemovedMediaFilePlayback=this.signalIrService.isRemovedMediaFilePlayback().subscribe((event:any) => {
      if(this.mediaServer && this.mediaServer.Guid==event.mediaServerGuid)
      {
        var index=this.listItems.findIndex(x=>x.Guid==event.mediaFilePlaybackGuid);
        if(index!=-1)
        {
          this.listItems.splice(index,1);
          this.ref.detectChanges();
        }
      }
    });
    this.subscriptionUpdateCurrentTimeMediaFilePlayback=this.signalIrService.isUpdatingCurrentTimeMediaFilePlayBack().subscribe((event:any) => {
      if(this.mediaServer && this.mediaServer.Guid==event.mediaServerGuid)
      {
        var item=this.listItems.find(x=>x.Guid==event.mediaFilePlaybackGuid);
        if(item)
        {
          item.ClientData.CurrentTime=event.currentTime;
          item.ClientData.IsPlaying=event.isPlaying;
          this.ref.detectChanges();
        }
      }
    });
    this.subscriptionEnableMediaServer=this.signalIrService.isEnablingMediaServer().subscribe((mediaServerGuid:string) => {
      if(this.mediaServer && this.mediaServer.Guid==mediaServerGuid && !this.mediaServer.isSecureConnection)
      {
        this.mediaServer.isSecureConnection=true;
        this.loadingConnection=false;
        this.ref.detectChanges();
        this.getAllItems();
      }
    });
    this.subscriptionDisableMediaServer=this.signalIrService.isDisablingMediaServer().subscribe((mediaServerGuid:string) => {
      if(this.mediaServer && this.mediaServer.Guid==mediaServerGuid && this.mediaServer.isSecureConnection)
      {
        this.mediaServer.isSecureConnection=false;
      }
    });
  }

  ngOnInit(): void {
    var mediaServerGuid=this.activeRoute.snapshot.params.serverGuid;
    var mediaServer=this.sharedDataService.mediaServers.find(x=>x.Guid==mediaServerGuid)
    if(mediaServer)
    {
      this.mediaServer=JSON.parse(JSON.stringify(mediaServer));
      if(mediaServer.isSecureConnection)
      {
        this.loadingConnection=false;
        this.getAllItems();
      }else{
        setTimeout(() => {
          this.loadingConnection=false;
        }, 3000);
      }
    }else{
      this.router.navigateByUrl('/404')
    }
  }


  ngOnDestroy(){
    this.subscriptionEnableMediaServer.unsubscribe();
    this.subscriptionDisableMediaServer.unsubscribe();
    this.subscriptionUpdateCurrentTimeMediaFilePlayback.unsubscribe();
    this.subscriptionAddedMediaFilePlayback.unsubscribe();
    this.subscriptionRemovedMediaFilePlayback.unsubscribe();
  }

  public getAllItems(){
    this.dashboardService.GetListMediaFilePlayback(this.mediaServer.Url).then((list:MediaFilePlayback[]) => {
      this.listItems=list;
    },error=>{

    });
  }

  public getFormattedDuration(time:any){
    var sec_num = parseInt(time, 10);
    var hours:any   = Math.floor(sec_num / 3600);
    var minutes:any = Math.floor((sec_num - (hours * 3600)) / 60);
    if(hours==0)
    {
      return minutes+'min';
    }else{
      return hours+'hr '+minutes+'min';
    }
  }

  public getPlayingMediaInfo(clientData:MediaFilePlaybackClient){
      var currentTime=this.getFormatTime(clientData.CurrentTime);
      var durationTime=this.getFormatTime(clientData.Duration);
      var isPlayingText=clientData.IsPlaying?'Playing':'Paused';
      return isPlayingText + " - "+currentTime+" / "+durationTime;
  }

  public getFormatTime(time:any){
    var sec_num = parseInt(time, 10); // don't forget the second param
    var hours:any   = Math.floor(sec_num / 3600);
    var minutes:any = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds:any = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
  }

  public getWidthProgressItem(clientData:MediaFilePlaybackClient){
    let widthProgressBarPercentaje=(clientData.CurrentTime/clientData.Duration)*100;
    return widthProgressBarPercentaje+'%';
  }

  public getInitials(fullName:string){
    let initial=fullName.substring(0,1);
    return initial;
  }

}
