import { ChangeDetectorRef, Component } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { MediaServer } from 'src/app/modules/pages/manage/modules/pages/servers/models/server.model';
import { Subscription } from 'rxjs';
import { SignalIRHubService } from 'src/app/modules/shared/services/signal-ir-hub.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaFilePlaybackRealTime } from 'src/app/modules/pages/media-video/models/media-file-playback-real-time.model';
import { SharedService } from 'src/app/modules/shared/services/shared-data.service';
import { MediaFilePlaybackClient } from 'src/app/modules/pages/media-video/models/media-file-playback-client.model';

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
  subscriptionAddMediaFilePlayback:Subscription;
  subscriptionRemoveMediaFilePlayback:Subscription;
  listItems:MediaFilePlaybackRealTime[];

  constructor(
    public sharedService: SharedService,
    private ref:ChangeDetectorRef,
    private router: Router,
    public activeRoute: ActivatedRoute,
    private signalIrService:SignalIRHubService,
    private dashboardService:DashboardService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.subscriptionAddMediaFilePlayback=this.signalIrService.isAddingMediaFilePlaybackRealTime().subscribe((event:any) => {
      if(this.mediaServer && this.mediaServer.Guid==event.mediaServerGuid)
      {
        var item=this.listItems.find(x=>x.Guid==event.mediaFilePlaybackRealTimeGuid);
        if(item==undefined)
        {
          this.dashboardService.GetListMediaFilePlaybackRealTime(this.mediaServer.Url).then((list:MediaFilePlaybackRealTime[]) => {
            var newItem=list.find(x=>x.Guid==event.mediaFilePlaybackRealTimeGuid);
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
    this.subscriptionRemoveMediaFilePlayback=this.signalIrService.isRemovingMediaFilePlaybackRealTime().subscribe((event:any) => {
      if(this.mediaServer && this.mediaServer.Guid==event.mediaServerGuid)
      {
        var index=this.listItems.findIndex(x=>x.Guid==event.mediaFilePlaybackRealTimeGuid);
        if(index!=-1)
        {
          this.listItems.splice(index,1);
          this.ref.detectChanges();
        }
      }
    });
    this.subscriptionUpdateCurrentTimeMediaFilePlayback=this.signalIrService.isUpdatingCurrentTimeMediaFilePlayBackRealTime().subscribe((event:any) => {
      if(this.mediaServer && this.mediaServer.Guid==event.mediaServerGuid)
      {
        var item=this.listItems.find(x=>x.Guid==event.mediaFilePlaybackRealTimeGuid);
        if(item)
        {
          item.ClientData.CurrentTime=event.currentTime;
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
    var mediaServer=this.sharedService.mediaServers.find(x=>x.Guid==mediaServerGuid)
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
    this.subscriptionAddMediaFilePlayback.unsubscribe();
    this.subscriptionRemoveMediaFilePlayback.unsubscribe();
  }

  public getAllItems(){
    this.dashboardService.GetListMediaFilePlaybackRealTime(this.mediaServer.Url).then((list:MediaFilePlaybackRealTime[]) => {
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
