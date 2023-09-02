import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import * as Dash from 'dashjs';
import {v4 as uuid} from "uuid";
import { SharedService } from 'src/app/modules/shared/services/shared-data.service';
import { parse } from '@plussub/srt-vtt-parser';
import Hls, { HlsConfig } from 'hls.js';
import { HttpMethodType, LoadVideoStatus, MediaType, MetadataAgents, VideoTransmissionType } from 'src/app/modules/shared/enums/enums';
import { RestProviderService } from 'src/app/modules/shared/services/rest-provider.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CustomDialogOptionsComponent, DialogOption, DialogOptionsConfiguration } from 'src/app/modules/shared/components/custom-dialog-options/custom-dialog-options.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { ItemDetail } from 'src/app/modules/pages/media-detail/models/item-detail.model';
import { MediaEpisode } from 'src/app/modules/pages/media-detail/models/media-episode.model';
import { TranscodedMediaFile } from '../../models/transcoded-media-file.model';
import { MediaFilePlayback } from '../../models/media-file-playback.model';
import { MediaFilePlaybackProfile } from '../../models/media-file-playback-profile.model';
import { MediaFilePlaybackClient } from '../../models/media-file-playback-client.model';
import { MediaFilePlaybackItem } from '../../models/media-file-playback-item.model';
import { RetranscodeMediaFile } from '../../models/retranscode-media-file.model';
import { SignalIRHubService } from 'src/app/modules/shared/services/signal-ir-hub.service';
import { LibraryService } from '../../../settings/modules/pages/server/modules/pages/manage/modules/pages/libraries/services/library.service';
import { MediaServer } from '../../../manage/modules/pages/servers/models/server.model';
import { MediaItem } from '../../../media-detail/models/media-item.model';
import { MediaFile } from '../../../media-detail/models/media-file.model';
@Component({
  selector: 'app-video',
  templateUrl: 'video.component.html',
  styleUrls: ['video.component.scss'],
})
export class VideoComponent implements OnInit,OnDestroy{

  _window=window;
  showVideo:boolean=true;
  lastCurrentTime:number=0;
  showControls:boolean=false;
  customMouseOutEvent:any;
  sliderContainer:any;
  @ViewChild('controlsContainer') controlsContainer: ElementRef;
  @ViewChild('settingsContainer') settingsContainer: ElementRef;
  @ViewChild('videoPrincipalContainer') videoPrincipalContainer: ElementRef;
  @ViewChild('videoTarget') videoTarget: ElementRef;
  detectChangesInterval:any;
  currentSubtitleData:any[]=undefined;
  haveError:boolean=false;
  currentEpisode:any={};
  lastTmpVideoTime:number;
  dashMediaPlayer:Dash.MediaPlayerClass;
  lastClickSeekButton:Date=new Date();
  countSeekSecondsToAdvance:number=0;
  lastTimeSpanChangeGUID:string;
  isUpdatingVideoSource:boolean=false;
  showingSettings:boolean=false;
  listPrincipalSettingsOptions=[{index:0,name:"AUDIO",listOptions:[],selectedOption:null},{index:1,name:"SUBTÍTULOS",listOptions:[],selectedOption:null}];
  currentSelectedPrincipalSettingOption:any;
  lastRealVideoTime=0;
  initializeVideo:boolean=false;
  hls:Hls;
  showVideoTarget:boolean=false;
  loadedData:boolean=false;
  beforeUnloadFunction:any=false;
  subscriptionEnableMediaServer:Subscription;
  subscriptionDisableMediaServer:Subscription;
  subscriptionRemoveMediaFilePlayback:Subscription;
  mediaServer:MediaServer;
  transcodedMediaFile:TranscodedMediaFile;
  itemDetail: ItemDetail;
  loadStatus: LoadVideoStatus;
  timeOutLoadVideoId:number;
  isRetranscoding:boolean=false;

  constructor(
    private signalIrService:SignalIRHubService,
    public activeRoute: ActivatedRoute,
    private router: Router,
    private libraryService:LibraryService,
    private dialog: MatDialog,
    public restProvider: RestProviderService,
    public sharedService: SharedService,
    public ref: ChangeDetectorRef,
    public http: HttpClient) {
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
      this.subscriptionEnableMediaServer=this.signalIrService.isEnablingMediaServer().subscribe((mediaServerGuid:string)=>{
        if(this.mediaServer && this.mediaServer.Guid==mediaServerGuid && !this.mediaServer.isSecureConnection)
        {
          this.mediaServer.isSecureConnection=true;
          this.getMediaItemDetailByMediaFileAndProfile();
        }
      });
      this.subscriptionDisableMediaServer=this.signalIrService.isDisablingMediaServer().subscribe((mediaServerGuid:string)=>{
        if(this.mediaServer && this.mediaServer.Guid==mediaServerGuid && this.mediaServer.isSecureConnection)
        {
          this.mediaServer.isSecureConnection=false;
          this.router.navigateByUrl('/media/server/'+mediaServerGuid);
        }
      });
      this.subscriptionRemoveMediaFilePlayback=this.signalIrService.isRemovingMediaFilePlayback().subscribe((event:any) => {
        if(this.mediaServer && this.mediaServer.Guid==event.mediaServerGuid && this.transcodedMediaFile && this.transcodedMediaFile.Guid==event.mediaFilePlaybackGuid)
        {
          this.router.navigateByUrl('/media/server/'+event.mediaServerGuid);
        }
      });
  }


  ngOnInit(): void {
    this.initializeEventsAndIntervals();
    var mediaServerGuid=this.activeRoute.snapshot.params.serverGuid;
    if(mediaServerGuid!=undefined)
    {
      var mediaServer=this.sharedService.mediaServers.find(x=>x.Guid==mediaServerGuid);
      if(mediaServer)
      {
        this.mediaServer=JSON.parse(JSON.stringify(mediaServer));
        if(this.mediaServer.isSecureConnection)
        {
          this.getMediaItemDetailByMediaFileAndProfile();
        }else{
          setTimeout(() => {
            if(this.mediaServer.isSecureConnection==false)
            {
              this.router.navigateByUrl('/media/server/'+mediaServerGuid);
            }
          }, 3000);
        }
      }
    }else{
      this.router.navigateByUrl('/404')
    }
  }

  ngOnDestroy(): void {
    if(!this.sharedService.configurationData.alwaysFullScreen && document.fullscreenElement) {
      document.exitFullscreen();
    }
    this.deleteTranscodedMediaFile();
    this.subscriptionEnableMediaServer.unsubscribe();
    this.subscriptionDisableMediaServer.unsubscribe();
    this.subscriptionRemoveMediaFilePlayback.unsubscribe();
    if(this.dashMediaPlayer)
    {
      this.dashMediaPlayer.reset();
      this.dashMediaPlayer.destroy();
    }
    if(this.hls)
    {
      this.hls.detachMedia();
      this.hls.destroy();
    }
    if(this.detectChangesInterval)
    {
      window.clearInterval(this.detectChangesInterval);
    }
    if(this.customMouseOutEvent)
    {
      window.removeEventListener('click',this.customMouseOutEvent);
    }
    if(this.beforeUnloadFunction)
    {
      window.removeEventListener('beforeunload',this.beforeUnloadFunction);
    }
    if(this.timeOutLoadVideoId)
    {
      clearTimeout(this.timeOutLoadVideoId);
      this.timeOutLoadVideoId=undefined;
    }
  }

  private initializeEventsAndIntervals(){
    let ctx=this;
    this.customMouseOutEvent=function onCustomMouseOut(event:any) {
      if(ctx.sliderContainer && ctx.sliderContainer.startMove)
      {
        ctx.onClickSlider(ctx.sliderContainer);
      }
    }
    window.addEventListener('click',this.customMouseOutEvent);
    this.beforeUnloadFunction=function onUnload(event:any) {
      ctx.deleteTranscodedMediaFile();
    }
    window.addEventListener('beforeunload',this.beforeUnloadFunction);
    this.detectChangesInterval=window.setInterval(function() {
      if(ctx.mediaServer && ctx.transcodedMediaFile && !ctx.isRetranscoding)
      {
        ctx.signalIrService.updateCurrentTimeMediaFilePlayBack(ctx.mediaServer.Guid,ctx.transcodedMediaFile.Guid,ctx.getCurrentVideoTime(),ctx.isPlayingVideo());
      }
      ctx.ref.detectChanges();
    }, 0);
  }

  private getMediaItemDetailByMediaFileAndProfile(){
    var mediaFileId=this.activeRoute.snapshot.params.mediaFileId;
    if(mediaFileId)
    {
      this.libraryService.GetMediaItemDetailByMediaFileAndProfile(this.mediaServer.Url,mediaFileId,this.sharedService.currentProfile.Id).then((itemDetail:ItemDetail)=>{
        this.itemDetail=itemDetail;
        this.CreateTranscodedMediaFile();
      },error=>{
        this.router.navigateByUrl('/404')
      });
    }else{
      this.router.navigateByUrl('/404')
    }
  }

  //Create Trnascoded Media File

  public CreateTranscodedMediaFile(){
    this.loadStatus=LoadVideoStatus.Empty;
    var currentTime=0;
    if(this.itemDetail.MediaFileProfile)
    {
      if(this.itemDetail.MediaFileProfile.CurrentTime>20)
      {
        currentTime=this.itemDetail.MediaFileProfile.CurrentTime-20;
      }else{
        currentTime=0;
      }
    }
    let url=this.mediaServer.Url+"/api/mediaFilePlaybacks/CreateTranscodedMediaFile";
    this.restProvider.executeHttpMediaServerApi(HttpMethodType.POST,url,this.GetMediaFilePlayback(currentTime)).then((response:SinovadApiGenericResponse) => {
      this.loadStatus=LoadVideoStatus.Generated;
      var transcodedMediaFile:TranscodedMediaFile=response.Data;
      this.transcodedMediaFile=transcodedMediaFile;
      this.initializeStreams();
      setTimeout(() => {
        this.executeHideControls();
      }, 1000);
      this.getVideoSource();
    },error=>{
      this.showLoadVideoErrorActionsDialog();
      console.error(error);
    });
  }

  private GetMediaFilePlayback(currentTime:number):MediaFilePlayback{
    var mediaFilePlayback:MediaFilePlayback;
    mediaFilePlayback = new MediaFilePlayback();
    mediaFilePlayback.Guid=uuid();
    var mediaFilePlaybackProfile = new MediaFilePlaybackProfile();
    mediaFilePlaybackProfile.ProfileId=this.sharedService.currentProfile.Id;
    mediaFilePlaybackProfile.ProfileName=this.sharedService.currentProfile.FullName;
    mediaFilePlaybackProfile.AvatarPath=this.sharedService.currentProfile.AvatarPath;
    mediaFilePlayback.ProfileData=mediaFilePlaybackProfile;
    var mediaFilePlaybackClient = new MediaFilePlaybackClient();
    mediaFilePlaybackClient.DeviceData=this.sharedService.deviceData;
    mediaFilePlaybackClient.IsPlaying=true;
    mediaFilePlaybackClient.CurrentTime=currentTime;
    mediaFilePlayback.ClientData=mediaFilePlaybackClient;
    if(this.itemDetail.MediaItem.MediaTypeId==MediaType.Movie)
    {
      var mediaFilePlaybackItem = new MediaFilePlaybackItem();
      var mediaFile=this.itemDetail.ListMediaFiles[0];
      mediaFilePlaybackItem.Title=this.itemDetail.MediaItem.ExtendedTitle;
      mediaFilePlaybackItem.PhysicalPath=mediaFile.PhysicalPath;
      mediaFilePlaybackItem.MediaFileId=mediaFile.Id;
      mediaFilePlaybackItem.PosterPath=this.getPosterPath(this.itemDetail.MediaItem,mediaFile);
      mediaFilePlayback.ItemData=mediaFilePlaybackItem;
    }
    if(this.itemDetail.MediaItem.MediaTypeId==MediaType.TvSerie)
    {
      var mediaFilePlaybackItem = new MediaFilePlaybackItem();
      var mediaFile=this.itemDetail.CurrentEpisode.ListMediaFiles[0];
      mediaFilePlaybackItem.MediaFileId=mediaFile.Id;
      mediaFilePlaybackItem.PhysicalPath=mediaFile.PhysicalPath;
      mediaFilePlaybackItem.Title=this.itemDetail.MediaItem.Title;
      mediaFilePlaybackItem.Subtitle="T"+this.itemDetail.CurrentEpisode.SeasonNumber+":E"+this.itemDetail.CurrentEpisode.EpisodeNumber+" "+this.itemDetail.CurrentEpisode.Name;
      mediaFilePlaybackItem.PosterPath=this.getPosterPath(this.itemDetail.MediaItem,mediaFile);
      mediaFilePlayback.ItemData=mediaFilePlaybackItem;
    }
    return mediaFilePlayback;
  }

  public getPosterPath(item:MediaItem,mediaFile:MediaFile){
    if(item.MetadataAgentsId==MetadataAgents.TMDb)
    {
      return this.sharedService.originalUrlImagesMovieDataBase+item.PosterPath;
    }else{
      if(item.PosterPath)
      {
        return item.PosterPath;
      }else{
        return this.mediaServer.Url+"/media/"+mediaFile.Guid+"/thumbnail.png";
      }
    }
  }

  //Retranscode Section

    public retranscodeMediaFile(newVideoTime:number){
      this.deleteLastTranscodedMediaFileProcess();
      var retranscodeMediaFileRequest= new RetranscodeMediaFile();
      retranscodeMediaFileRequest.Guid= this.transcodedMediaFile.Guid;
      retranscodeMediaFileRequest.NewTime=newVideoTime;
      this.loadStatus=LoadVideoStatus.Empty;
      let url=this.mediaServer.Url+"/api/mediaFilePlaybacks/RetranscodeMediaFile";
      this.isRetranscoding=true;
      this.restProvider.executeHttpMediaServerApi(HttpMethodType.PUT,url,retranscodeMediaFileRequest).then((response:SinovadApiGenericResponse) => {
        this.isRetranscoding=false;
        this.transcodedMediaFile.InitialTime=newVideoTime;
        this.transcodedMediaFile.Url=response.Data;
        this.loadStatus=LoadVideoStatus.Generated;
        this.updateAudioAndVideoList();
        this.getVideoSource();
      },error=>{
        this.isRetranscoding=false;
        this.showLoadVideoErrorActionsDialog();
        console.error(error);
      });
    }

//Delete Transcode Media File Section

  public deleteTranscodedMediaFile(){
    if(this.timeOutLoadVideoId)
    {
      clearTimeout(this.timeOutLoadVideoId);
      this.timeOutLoadVideoId=undefined;
    }
    this.signalIrService.removeMediaFilePlayBack(this.mediaServer.Guid,this.transcodedMediaFile.Guid);
  }

  public deleteLastTranscodedMediaFileProcess(){
    if(this.timeOutLoadVideoId)
    {
      clearTimeout(this.timeOutLoadVideoId);
      this.timeOutLoadVideoId=undefined;
    }
    this.signalIrService.removeLastTranscodedMediaFileProcess(this.mediaServer.Guid,this.transcodedMediaFile.Guid);
  }

  public GetFullVideoTitle(){
    var fullVideoTitle="";
    if(this.itemDetail && this.itemDetail.MediaItem.MediaTypeId==MediaType.Movie)
    {
      fullVideoTitle=this.itemDetail.MediaItem.ExtendedTitle;
    }
    if(this.itemDetail && this.itemDetail.MediaItem.MediaTypeId==MediaType.TvSerie)
    {
      fullVideoTitle=this.itemDetail.MediaItem.Title+" T"+this.itemDetail.CurrentEpisode.SeasonNumber+":E"+this.itemDetail.CurrentEpisode.EpisodeNumber+" "+this.itemDetail.CurrentEpisode.Name;
    }
    return fullVideoTitle;
  }

  //Change Episode Section

  public isEnablePreviousEpisodeButton(){
    if(this.itemDetail && this.itemDetail.ListSeasons && this.itemDetail.ListSeasons.length>0 && this.itemDetail.CurrentSeason)
    {
      let currentSeasonNumber=this.itemDetail.CurrentSeason.SeasonNumber;
      let currentEpisodeNumber=this.itemDetail.CurrentEpisode.EpisodeNumber;
      let nextEpisodeNumber=currentEpisodeNumber-1;
      let index=this.itemDetail.CurrentSeason.ListEpisodes.findIndex(item=>item.EpisodeNumber==nextEpisodeNumber);
      if(index!=-1)
      {
        return true;
      }else{
        let nextSeasonNumber=currentSeasonNumber-1;
        let index=this.itemDetail.ListSeasons.findIndex(item=>item.SeasonNumber==nextSeasonNumber);
        if(index!=-1)
        {
          let previousSeason=this.itemDetail.ListSeasons[index];
          if(previousSeason && previousSeason.ListEpisodes && previousSeason.ListEpisodes.length){
            return true;
          }else{
            return false;
          }
        }else{
          return false;
        }
      }
    }else{
      return false;
    }
  }

  public isEnableNextEpisodeButton(){
    if(this.itemDetail && this.itemDetail.ListSeasons && this.itemDetail.ListSeasons.length>0 && this.itemDetail.CurrentSeason)
    {
      let currentSeasonNumber=this.itemDetail.CurrentSeason.SeasonNumber;
      let currentEpisodeNumber=this.itemDetail.CurrentEpisode.EpisodeNumber;
      let nextEpisodeNumber=currentEpisodeNumber+1;
      let index=this.itemDetail.CurrentSeason.ListEpisodes.findIndex(item=>item.EpisodeNumber==nextEpisodeNumber);
      if(index!=-1)
      {
        return true;
      }else{
        let nextSeasonNumber=currentSeasonNumber+1;
        let index=this.itemDetail.ListSeasons.findIndex(item=>item.SeasonNumber==nextSeasonNumber);
        if(index!=-1)
        {
          let nextSeason=this.itemDetail.ListSeasons[index];
          if(nextSeason && nextSeason.ListEpisodes && nextSeason.ListEpisodes.length){
            return true;
          }else{
            return false;
          }
        }else{
          return false;
        }
      }
    }else{
      return false;
    }
  }

  public goToNextEpisode(){
    if(this.itemDetail  && this.itemDetail.ListSeasons && this.itemDetail.ListSeasons.length>0 && this.itemDetail.CurrentSeason)
    {
      let currentSeasonNumber=this.itemDetail.CurrentSeason.SeasonNumber;
      let currentEpisodeNumber=this.itemDetail.CurrentEpisode.EpisodeNumber;
      let nextEpisodeNumber=currentEpisodeNumber+1;
      let index=this.itemDetail.CurrentSeason.ListEpisodes.findIndex(item=>item.EpisodeNumber==nextEpisodeNumber);
      if(index!=-1)
      {
        let nextEpisode=this.itemDetail.CurrentSeason.ListEpisodes[index];
        this.getVideoByEpisode(nextEpisode);
      }else{
        let nextSeasonNumber=currentSeasonNumber+1;
        let index=this.itemDetail.ListSeasons.findIndex(item=>item.SeasonNumber==nextSeasonNumber);
        if(index!=-1)
        {
          let nextSeason=this.itemDetail.ListSeasons[index];
          this.itemDetail.CurrentSeason=nextSeason;
          if(nextSeason && nextSeason.ListEpisodes && nextSeason.ListEpisodes.length){
            let nextEpisode=nextSeason.ListEpisodes[0];
            this.getVideoByEpisode(nextEpisode);
          }
        }
      }
    }
  }

  public goToPreviousEpisode(){
    if(this.itemDetail &&  this.itemDetail.ListSeasons && this.itemDetail.ListSeasons.length>0 && this.itemDetail.CurrentSeason)
    {
      let currentSeasonNumber=this.itemDetail.CurrentSeason.SeasonNumber;
      let currentEpisodeNumber=this.itemDetail.CurrentEpisode.EpisodeNumber;
      let previousEpisodeNumber=currentEpisodeNumber-1;
      let index=this.itemDetail.CurrentSeason.ListEpisodes.findIndex(item=>item.EpisodeNumber==previousEpisodeNumber);
      if(index!=-1)
      {
        let previousEpisode=this.itemDetail.CurrentSeason.ListEpisodes[index];
        this.getVideoByEpisode(previousEpisode);
      }else{
        let previousSeasonNumber=currentSeasonNumber+1;
        let index=this.itemDetail.ListSeasons.findIndex(item=>item.SeasonNumber==previousSeasonNumber);
        if(index!=-1)
        {
          let previousSeason=this.itemDetail.ListSeasons[index];
          this.itemDetail.CurrentSeason=previousSeason;
          if(previousSeason && previousSeason.ListEpisodes && previousSeason.ListEpisodes.length){
            let previousEpisode=previousSeason.ListEpisodes[previousSeason.ListEpisodes.length-1];
            this.getVideoByEpisode(previousEpisode);
          }
        }
      }
    }
  }

  public getVideoByEpisode(episode:MediaEpisode){
    this.deleteTranscodedMediaFile();
    if(this.itemDetail.ListSeasons)
    {
      this.itemDetail.CurrentSeason=this.itemDetail.ListSeasons.find(item=>item.SeasonNumber==episode.SeasonNumber);
      this.itemDetail.CurrentEpisode=this.itemDetail.CurrentSeason.ListEpisodes.find(item=>item.EpisodeNumber==episode.EpisodeNumber);
    }
    this.lastRealVideoTime=0;
    this.resetStream();
    this.loadStatus=LoadVideoStatus.Empty;
    let url=this.mediaServer.Url+"/api/mediaFilePlaybacks/CreateTranscodedMediaFile";
    this.restProvider.executeHttpMediaServerApi(HttpMethodType.POST,url,this.GetMediaFilePlayback(0)).then((response:SinovadApiGenericResponse) => {
      this.loadStatus=LoadVideoStatus.Generated;
      var transcodedMediaFile:TranscodedMediaFile=response.Data;
      this.transcodedMediaFile=transcodedMediaFile;
      this.initializeStreams();
      this.getVideoSource();
    },error=>{
      this.showLoadVideoErrorActionsDialog();
      console.error(error);
    });
  }




  public onTouchVideoContainer(target?:any){
    if(!this.showingSettings)
    {
      if(this.sharedService.isMobileDevice())
      {
        this.showControlsTemporarily(target);
      }
    }
  }

  public onClickVideoContainer(target:any){
    if(!this.showingSettings)
    {
      target.clicked=true;
      setTimeout(() => {
        target.clicked=false;
      }, 2000);
      if(!this.sharedService.isMobileDevice())
      {
        this.showControlsTemporarily(target);
      }
    }
  }

  public onTouchStartSlider(event:any,sliderContainer:any,controlLeft:any){
    this.sliderContainer=sliderContainer;
    sliderContainer.startMove=true;
    let percentajeCurrentTime=((event.changedTouches[0].clientX-controlLeft.offsetWidth-8-4)/(sliderContainer.offsetWidth))*100;
    let percentajeDuration=100;
    let duration=this.transcodedMediaFile.Duration;
    let currentTime=(percentajeCurrentTime*duration/percentajeDuration);
    this.lastTmpVideoTime=currentTime;
  }

  public onTouchMoveSlider(event:any,sliderContainer:any,controlLeft:any){
    if(sliderContainer.startMove)
    {
      let percentajeCurrentTime=((event.changedTouches[0].clientX-controlLeft.offsetWidth-8-4)/(sliderContainer.offsetWidth))*100;
      let percentajeDuration=100;
      let duration=this.transcodedMediaFile.Duration;
      let currentTime=(percentajeCurrentTime*duration/percentajeDuration);
      this.lastTmpVideoTime=currentTime;
    }
  }


  public showSettings(){
    this.showControls=false;
    this.ref.detectChanges();
    this.showingSettings=true;
    this.ref.detectChanges();
  }

  public hideSettings(){
    this.showingSettings=false;
    this.ref.detectChanges();
  }

  public onClickPrincipalSettingsOption(po:any){
    this.currentSelectedPrincipalSettingOption=po;
  }

  public onClickStreamOption(option:any){
    this.currentSelectedPrincipalSettingOption.selectedOption=option;
    this.showingSettings=false;
    this.ref.detectChanges();
    if(this.currentSelectedPrincipalSettingOption.index==0)
    {
      //update audio stream
      this.hls.audioTrack=option.index;
    }
    if(this.currentSelectedPrincipalSettingOption.index==1)
    {
      //update Subtitle Stream
      if(option.index==1000000)
      {
        this.hls.subtitleDisplay=false;
      }else{
        this.hls.subtitleTrack=option.index;
        this.hls.subtitleDisplay=true;
      }
    }
  }

  public getSubtitle(subtitlePath:string){
    let ctx=this;
    this.http.get(subtitlePath, { responseType: 'text' }).subscribe((data:any) => {
      if(data && parse(data) && parse(data).entries)
      {
        ctx.currentSubtitleData = parse(data).entries;
        if(ctx.currentSubtitleData.length==0)
        {
          setTimeout(() => {
            ctx.getSubtitle(subtitlePath);
          }, 1000);
        }else{
          ctx.ref.detectChanges();
        }
      }else{
        console.error("No hay data en los subtitulos aun");
        setTimeout(() => {
          ctx.getSubtitle(subtitlePath);
        }, 1000);
      }
    },error=>{
      console.error(error);
      setTimeout(() => {
        ctx.getSubtitle(subtitlePath);
      }, 1000);
    });
  }

  public closeVideo(){
    this.router.navigateByUrl("/home");
  }

  public getConfirmMessage():string{
    var status="Vacio";
    switch (this.loadStatus) {

      case LoadVideoStatus.Empty:{
        status="Vacío"
        break;
      }
      case LoadVideoStatus.Generated:{
        status="Generado"
        break;
      }
      case LoadVideoStatus.Initialized:{
        status="Inicializado"
        break;
      }
      case LoadVideoStatus.LoadedMetada:{
        status="Cargado Metadata"
        break;
      }
      case LoadVideoStatus.LoadedData:{
        status="Cargado Data"
        break;
      }
      default: {
        break;
      }
    }
    let message="Hubo un error al intentar reproducir el video, se quedo con el estado de "+status+", desea intentarlo de nuevo?"
    return message;
  }

  public updateAudioAndVideoList(){
    this.listPrincipalSettingsOptions[0].listOptions=[];
    this.listPrincipalSettingsOptions[0].selectedOption=undefined;
    this.listPrincipalSettingsOptions[1].listOptions=[];
    this.listPrincipalSettingsOptions[1].selectedOption=undefined;
    if(this.transcodedMediaFile.ListAudioStreams && this.transcodedMediaFile.ListAudioStreams.length>0)
    {
      this.transcodedMediaFile.ListAudioStreams.forEach(element => {
        let languageName=""
        if(element.language=="spa")
        {
          languageName="Español"
        }
        if(element.language=="eng")
        {
          languageName="Ingles"
        }
        if(element.title)
        {
          languageName=languageName+" ("+element.title+")";
        }
        element.name=languageName;
      });
      this.listPrincipalSettingsOptions[0].listOptions=this.transcodedMediaFile.ListAudioStreams;
      this.listPrincipalSettingsOptions[0].selectedOption=this.transcodedMediaFile.ListAudioStreams.find(audio=>audio.isDefault==true);
    }
    if(this.transcodedMediaFile.ListSubtitleStreams && this.transcodedMediaFile.ListSubtitleStreams.length>0)
    {
      this.transcodedMediaFile.ListSubtitleStreams.forEach(element => {
        let languageName=""
        if(element.language=="spa")
        {
          languageName="Español"
        }
        if(element.language=="eng")
        {
          languageName="Ingles"
        }
        if(element.title)
        {
          languageName=languageName+" ("+element.title+")";
        }
        element.name=languageName;
      });
      let listSubtitlesStreams:any[]=[];
      listSubtitlesStreams.push({index:1000000,name:"Ninguno"})
      listSubtitlesStreams=listSubtitlesStreams.concat(this.transcodedMediaFile.ListSubtitleStreams);
      this.listPrincipalSettingsOptions[1].listOptions=listSubtitlesStreams;
      let selectedSubtitle =this.transcodedMediaFile.ListSubtitleStreams.find(subt=>subt.isDefault==true);
      if(selectedSubtitle==undefined)
      {
        selectedSubtitle=listSubtitlesStreams.find(item=>item.index==1000000);
      }
      this.listPrincipalSettingsOptions[1].selectedOption=selectedSubtitle;
    }
    this.currentSelectedPrincipalSettingOption=this.listPrincipalSettingsOptions[0];
  }

  public initializeStreams(){
    this.updateAudioAndVideoList();
    if(this.transcodedMediaFile.InitialTime!=undefined)
    {
      this.lastRealVideoTime=this.transcodedMediaFile.InitialTime;
    }else{
      this.lastRealVideoTime=0;
    }
  }


  public executeHideControls(){
    if(this.sliderContainer && this.sliderContainer.startMove)
    {
      setTimeout(() => {
        this.executeHideControls();
      }, 2000);
    }else{
      this.showControls=false;
    }
  }

  public getDurationTime(){
    if(this.transcodedMediaFile && this.transcodedMediaFile.Duration)
    {
      return this.getFormatTime(this.transcodedMediaFile.Duration);
    }else{
      return "00:00:00";
    }
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

  public getVideoTime(){
    if(this.lastTmpVideoTime)
    {
      return this.getFormatTime(this.lastTmpVideoTime);
    }else{
      let currentVideoTime=this.getCurrentVideoTime();
      if(currentVideoTime!=undefined && currentVideoTime>0)
      {
        return this.getFormatTime(currentVideoTime);
      }else{
        return "00:00:00";
      }
    }
  }

  public onMouseDownSlider(event:any,sliderContainer:any){
    this.sliderContainer=sliderContainer;
    sliderContainer.startMove=true;
    this.calculateNewTimeToGo(event,sliderContainer);
}

public onMouseMoveSlider(event:any,sliderContainer:any){
  if(sliderContainer.startMove)
  {
    this.calculateNewTimeToGo(event,sliderContainer);
  }
}

public calculateNewTimeToGo(event:any,sliderContainer:any){
  let percentajeCurrentTime=((event.offsetX)/(sliderContainer.offsetWidth))*100;
  let percentajeDuration=100;
  let duration=this.transcodedMediaFile.Duration;
  let newTimeToGo=(percentajeCurrentTime*duration/percentajeDuration);
  this.lastTmpVideoTime=newTimeToGo;
}

public resetStream(){
  this.showVideoTarget=false;
  this.loadedData=false;
  if(this.dashMediaPlayer!=undefined)
  {
    this.dashMediaPlayer.resetSettings();
    this.dashMediaPlayer.reset();
    this.dashMediaPlayer.destroy();
    this.dashMediaPlayer=undefined;
  }
  if(this.hls)
  {
    this.hls.destroy();
    this.hls=undefined;
  }
}

public onClickSlider(sliderContainer:any){
  if(this.lastTmpVideoTime)
  {
    sliderContainer.startMove=false;
    if(this.lastTmpVideoTime>this.getCurrentVideoTime()) // cuando avanzas en el video
    {
        let secondsToAdvance=this.lastTmpVideoTime-this.getCurrentVideoTime();
        this.executeForwardVideo(secondsToAdvance);
    }else if(this.lastTmpVideoTime<this.getCurrentVideoTime()){ //cuando retrocedes en el video
      let secondsToReduce=this.getCurrentVideoTime()-this.lastTmpVideoTime;
      this.executeRewindVideo(secondsToReduce);
    }
    this.lastTmpVideoTime=undefined;
  }
}


  public getSliderPogressWidth(){
    if(this.transcodedMediaFile && this.transcodedMediaFile.Duration)
    {
      let duration=this.transcodedMediaFile.Duration;
      let currentTime=this.lastTmpVideoTime?this.lastTmpVideoTime:this.getCurrentVideoTime();
      let widthProgressBarPercentaje=(currentTime/duration)*100;
      if(widthProgressBarPercentaje>100)
      {
        widthProgressBarPercentaje=100;
      }
      return widthProgressBarPercentaje+'%';
    }else{
      return 0;
    }
  }

  public OnEndedVideo(){
    if(this.isEnableNextEpisodeButton())
    {
      this.goToNextEpisode();
    }
  }

  public isPlayingVideo(){
    if(this.transcodedMediaFile && this.transcodedMediaFile.VideoTransmissionTypeId==VideoTransmissionType.MPEGDASH)
    {
      if(this.dashMediaPlayer && !this.dashMediaPlayer.isPaused())
      {
        return true;
      }else{
        return false;
      }
    }else{
      if(this.videoTarget && this.videoTarget.nativeElement.paused==false)
      {
        return true;
      }else{
        return false;
      }
    }
  }

  public playOrPauseVideo(){
    console.log("subtitle tracks");
    console.log(this.hls.subtitleTracks);

    console.log("audio tracks");
    console.log(this.hls.audioTracks);

   /*  if(this.hls.audioTrack==1)
    {
      this.hls.audioTrack=0;
    }else{
      this.hls.audioTrack=1;
    } */

    if(this.transcodedMediaFile && this.transcodedMediaFile.VideoTransmissionTypeId==VideoTransmissionType.MPEGDASH)
    {
      if(this.dashMediaPlayer)
      {
        if(this.dashMediaPlayer.isPaused())
        {
          this.dashMediaPlayer.play();
        }else{
          this.dashMediaPlayer.pause();
        }
      }
    }else{
      if(this.videoTarget)
      {
        if(this.videoTarget.nativeElement.paused)
        {
          this.videoTarget.nativeElement.play();
        }else{
          this.videoTarget.nativeElement.pause();
        }
      }
    }
  }

  public showVideoInFullScreen(){
    this.toggleFullScreenVideo();
  }

  public toggleFullScreenVideo(){
    if (document.fullscreenElement) {
      //document.exitFullscreen();
    } else {
      if (document.body.requestFullscreen) {
        document.body.requestFullscreen();
      }
    }
  }

  public displayVideoUsingDash(videoSrc:string){
    let ctx=this;
    this.dashMediaPlayer = Dash.MediaPlayer().create();
    this.dashMediaPlayer.updateSettings(
      {
        streaming: {
          gaps:{
            jumpGaps:true,
            jumpLargeGaps:true,
            enableSeekFix:true,
            enableStallFix:true
          },
          buffer: {
            bufferPruningInterval:this.transcodedMediaFile.Duration,
            bufferToKeep:this.transcodedMediaFile.Duration
          }
        }
      }
      )
    this.dashMediaPlayer.initialize(this.videoTarget.nativeElement, videoSrc);
    this.dashMediaPlayer.on(Dash.MediaPlayer.events.ERROR, function (data) {
      console.log(data);
      console.error("hubo un error");
    });
    this.dashMediaPlayer.on(Dash.MediaPlayer.events.PLAYBACK_ERROR, function (data) {
      console.log(data);
      console.error("hubo un error de playback");
    });
    this.dashMediaPlayer.on(Dash.MediaPlayer.events.PLAYBACK_WAITING, function (data:any) {
      console.error("PLAYBACK_WAITING");
      console.log(data);
    });
    this.dashMediaPlayer.on(Dash.MediaPlayer.events.BUFFER_EMPTY, function (data) {
      console.error("BUFFER_EMPTY");
      console.log(data);
    });
    this.dashMediaPlayer.on(Dash.MediaPlayer.events.STREAM_INITIALIZED, function (data) {
      console.error("STREAM_INITIALIZED");
      ctx.initializeVideo=true;
      console.log(data);
    });
    this.ref.detectChanges();
    this.dashMediaPlayer.play();
    this.showVideoInFullScreen();
  }

  public getCurrentVideoTime(){
    if(this.transcodedMediaFile && this.transcodedMediaFile.VideoTransmissionTypeId==VideoTransmissionType.MPEGDASH)
    {
      if(this.dashMediaPlayer && this.dashMediaPlayer.time())
      {
        return this.lastRealVideoTime+this.dashMediaPlayer.time();
      }else{
        return this.lastRealVideoTime;
      }
    }else{
      if(this.videoTarget && this.videoTarget.nativeElement.currentTime!=undefined)
      {
        return this.lastRealVideoTime+this.videoTarget.nativeElement.currentTime;
      }else{
        return this.lastRealVideoTime;
      }
    }
  }

  public checkIfDisplaySubtitles(subtitle:any){
    let currentVideoTime=this.getCurrentVideoTime();
    let msVideoTime=((currentVideoTime-1)*1000);
    if(subtitle.from<=msVideoTime && subtitle.to>=msVideoTime)
    {
      return true;
    }else{
      return false;
    }
  }

  public onDeclineReplyVideo(){
    this.closeVideo();
  }

  public onConfirmReplyVideo(){
    if(this.getCurrentVideoTime()-2>=0)
    {
      this.lastRealVideoTime=this.getCurrentVideoTime()-2;
    }else{
      this.lastRealVideoTime=0;
    }
    this.resetStream();
    this.callUpdateVideoData(this.lastRealVideoTime);
  }

  public onLoadedMetadata(){
    this.loadStatus=LoadVideoStatus.LoadedMetada;
    console.log("onLoadedMetadata");
  }

  public onLoadedData(){
    console.log("onLoadedData");
    this.loadStatus=LoadVideoStatus.LoadedData;
    this.loadedData=true;
    if(this.videoTarget)
    {
      this.videoTarget.nativeElement.currentTime=0;
      this.videoTarget.nativeElement.play();
    }
  }

  public onErrorVideo(){
    console.log("onErrorVideo");
  }

  public getVideoSource(){
    this.http.get(this.transcodedMediaFile.Url,{headers:undefined, responseType: 'blob' as 'json' }).subscribe((response:any) => {
      this.loadStatus=LoadVideoStatus.Initialized;
      this.showVideoTarget=true;
      this.ref.detectChanges();
      if(this.transcodedMediaFile.Url.indexOf("mpd")!=-1)
      {
          this.displayVideoUsingDash(this.transcodedMediaFile.Url);
      }else if(this.transcodedMediaFile.Url.indexOf("m3u8")!=-1)
      {
        this.displayVideoUsingHLS(this.transcodedMediaFile.Url);
      }else{
        this.videoTarget.nativeElement.src=this.transcodedMediaFile.Url;
        this.videoTarget.nativeElement.currentTime=this.lastRealVideoTime;
        this.lastRealVideoTime=0;
        this.videoTarget.nativeElement.play();
      }
    },error=>{
      console.error(error);
      this.showLoadVideoErrorActionsDialog();
    });
  }

  public displayVideoUsingHLS(videoSrc:string){
    let ctx=this;
    this.timeOutLoadVideoId=setTimeout(() => {
      if(ctx.loadStatus!=LoadVideoStatus.LoadedData)
      {
        ctx.showLoadVideoErrorActionsDialog();
      }
    }, 10000,ctx);
    this.showVideoInFullScreen();
    if (Hls.isSupported()) {
      this.hls = new Hls();
      this.hls.attachMedia(this.videoTarget.nativeElement);
      this.hls.loadSource(videoSrc);
      this.hls.on(Hls.Events.MEDIA_ATTACHED,function(e) {
        console.log("MEDIA_ATTACHED");
        console.log(e);
      });
      this.hls.on(Hls.Events.AUDIO_TRACK_LOADED,function(e) {
        console.log("AUDIO_LOADED");
        console.log(e);
      });
      this.hls.on(Hls.Events.MANIFEST_LOADED,function(e) {
        console.log("MANIFEST_LOADED");
        console.log(e);
      });
      this.hls.on(Hls.Events.MANIFEST_PARSED,function(e) {
        console.log("MANIFEST_PARSED");
        console.log(e);
      });
      this.hls.on(Hls.Events.ERROR,function(e) {
        ctx.videoTarget.nativeElement.CurrentTime=ctx.videoTarget.nativeElement.CurrentTime+1;
        console.error("Ocurrio un error");
        console.log(e);
      });
    }else{
      this.loadedData=true;
      if(this.videoTarget)
      {
        this.videoTarget.nativeElement.src = videoSrc;
        this.videoTarget.nativeElement.currentTime=0;
        this.videoTarget.nativeElement.play();
      }
    }
  }

  public onChangeObjectContain(){
    if(this.videoTarget.nativeElement.style.objectFit=="contain" || this.videoTarget.nativeElement.style.objectFit=="")
    {
      this.videoTarget.nativeElement.style.objectFit="cover";
    }else if(this.videoTarget.nativeElement.style.objectFit=="cover"){
      this.videoTarget.nativeElement.style.objectFit="fill";
    }else if(this.videoTarget.nativeElement.style.objectFit=="fill"){
      this.videoTarget.nativeElement.style.objectFit="contain";
    }
  }

  public callUpdateVideoData(currentVideoTime:any){
    let lastTimeSpanChangeGUID=uuid();
    this.lastTimeSpanChangeGUID=lastTimeSpanChangeGUID;
    setTimeout(() => {
      if(lastTimeSpanChangeGUID==this.lastTimeSpanChangeGUID)
      {
        this.retranscodeMediaFile(currentVideoTime);
      }
    }, 1000);
  }

  public rewindVideo(){
    this.executeRewindVideo(10);
  }

  public executeRewindVideo(maxSecondsToRest:number){
    this.initializeVideo=false;
    let seconsToRest=0;
    if(this.getCurrentVideoTime()-maxSecondsToRest>=0)
    {
      seconsToRest=maxSecondsToRest;
    }else{
      seconsToRest=this.getCurrentVideoTime();
    }
    if(this.transcodedMediaFile && this.transcodedMediaFile.VideoTransmissionTypeId==VideoTransmissionType.MPEGDASH)
    {
      if(this.dashMediaPlayer && this.dashMediaPlayer.time()>seconsToRest)
      {
        this.dashMediaPlayer.seek(this.dashMediaPlayer.time()-seconsToRest);
      }else{
        this.lastRealVideoTime=this.getCurrentVideoTime()-seconsToRest;
        this.resetStream();
        this.callUpdateVideoData(this.lastRealVideoTime);
      }
    }else{
      if(this.videoTarget && this.videoTarget.nativeElement.currentTime!=undefined && this.videoTarget.nativeElement.currentTime>seconsToRest)
      {
        this.videoTarget.nativeElement.currentTime=this.videoTarget.nativeElement.currentTime-seconsToRest;
      }else{
        this.lastRealVideoTime=this.getCurrentVideoTime()-seconsToRest;
        this.resetStream();
        this.callUpdateVideoData(this.lastRealVideoTime);
      }
    }
  }

  public forwardVideo(){
    let maxSecondsToAdd=10;
    this.executeForwardVideo(maxSecondsToAdd);
  }

  public executeForwardVideo(maxSecondsToAdd:number){
    this.initializeVideo=false;
    if(this.getCurrentVideoTime()<this.transcodedMediaFile.Duration)
    {
      let seconsToAdd=0;
      if(this.getCurrentVideoTime()+maxSecondsToAdd>this.transcodedMediaFile.Duration)
      {
        if(this.transcodedMediaFile.Duration>this.getCurrentVideoTime())
        {
          seconsToAdd=this.transcodedMediaFile.Duration-this.getCurrentVideoTime();
        }else{
          seconsToAdd=0;
        }
      }else{
        seconsToAdd=maxSecondsToAdd;
      }
      if(this.transcodedMediaFile && this.transcodedMediaFile.VideoTransmissionTypeId==VideoTransmissionType.MPEGDASH)
      {
        if(this.dashMediaPlayer && this.dashMediaPlayer.duration()-this.dashMediaPlayer.time()>=seconsToAdd)
        {
          this.dashMediaPlayer.seek(this.dashMediaPlayer.time()+seconsToAdd);
        }else{
          this.lastRealVideoTime=this.getCurrentVideoTime()+seconsToAdd;
          this.resetStream();
          this.callUpdateVideoData(this.lastRealVideoTime);
        }
      }else{
        if(this.videoTarget && this.videoTarget.nativeElement.duration!=undefined && this.videoTarget.nativeElement.currentTime!=undefined && this.videoTarget.nativeElement.duration-this.videoTarget.nativeElement.currentTime>=seconsToAdd)
        {
          this.videoTarget.nativeElement.currentTime=this.videoTarget.nativeElement.currentTime+seconsToAdd;
        }else{
          this.lastRealVideoTime=this.getCurrentVideoTime()+seconsToAdd;
          this.resetStream();
          this.callUpdateVideoData(this.lastRealVideoTime);
        }
      }
    }
  }

  public onMouseMoveVideoContainer(target?:any){
    if(!this.showControls && !target.clicked && !this.showingSettings)
    {
      this.showControlsTemporarily(target);
    }
  }

  public executeShowControlsTemporarily(target:any,currentGUID:string){
    this.showControls=true;
    this.ref.detectChanges();
    setTimeout(() => {
      if(target.guid==currentGUID)
      {
        this.executeHideControls();
      }
    }, 2000);
  }

  public showControlsTemporarily(target?:any){
    if(!this.showControls)
    {
      let guid=uuid();
      target.guid=guid;
      if(this.sharedService.isMobileDevice())
      {
        setTimeout(() => {
          this.executeShowControlsTemporarily(target,guid);
        }, 250);
      }else{
        this.executeShowControlsTemporarily(target,guid);
      }
    }
  }

  public toogleVideoControls(target?:any){
    if(!this.showControls)
    {
      this.showControlsTemporarily(target);
    }else{
      this.showControls=true;
    }
  }


  //dialog section

  public showLoadVideoErrorActionsDialog(){
    var config = new MatDialogConfig<DialogOptionsConfiguration>();
    config.disableClose=true;
    config.data={
      title:"Mensaje",
      message:this.getConfirmMessage(),
      actions:[{text:"No",key:"No"},{text:"Si",key:"Si"}]
    }
    this.dialog.open(CustomDialogOptionsComponent,config).afterClosed().subscribe((action: DialogOption) => {
        if(action.key=="Si")
        {
          this.onConfirmReplyVideo();
        }
        if(action.key=="No")
        {
          this.onDeclineReplyVideo();
        }
    });
  }

}
