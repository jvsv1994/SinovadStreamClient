import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import * as Dash from 'dashjs';
import {v4 as uuid} from "uuid";
import hiBase64 from 'hi-base64';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { parse } from '@plussub/srt-vtt-parser';
import Hls, { HlsConfig } from 'hls.js';
import { HttpMethodType, LoadVideoStatus, VideoTransmissionType } from 'src/app/shared/enums';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BuilderVideo } from '../models/builderVideo';
import { TranscodeRunVideo } from '../models/transcodeRunVideo';
import { CustomDialogOptionsComponent, DialogOption, DialogOptionsConfiguration } from 'src/app/shared/components/custom-dialog-options/custom-dialog-options.component';
import { LibraryService } from 'src/app/libraries/shared/library.service';
import { MediaEpisode } from '../../shared/media-episode.model';
import { MediaFilePlayback } from '../../shared/media-file-playback.model';
@Component({
  selector: 'app-video',
  templateUrl: 'video.page.html',
  styleUrls: ['video.page.scss'],
})
export class VideoPage implements OnInit,OnDestroy{

  @Output() outputCloseVideo =new EventEmitter();
  @Input() builderVideo: BuilderVideo;
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
  updateMediaFilePlaybackInterval:any;
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

  constructor(
    private libraryService:LibraryService,
    private dialog: MatDialog,
    public restProvider: RestProviderService,
    public sharedService: SharedService,
    public ref: ChangeDetectorRef,
    public http: HttpClient) {


  }

  ngOnInit(): void {
    let ctx=this;
    this.customMouseOutEvent=function onCustomMouseOut(event:any) {
      if(ctx.sliderContainer && ctx.sliderContainer.startMove)
      {
        ctx.onClickSlider(ctx.sliderContainer);
      }
    }
    window.addEventListener('click',this.customMouseOutEvent);
    this.beforeUnloadFunction=function onUnload(event:any) {
      ctx.deleteAllProcessesAndDirectories();
    }
    window.addEventListener('beforeunload',this.beforeUnloadFunction);
    this.detectChangesInterval=window.setInterval(function() {
      ctx.ref.detectChanges();
    }, 0);
    this.updateMediaFilePlaybackInterval=window.setInterval(function() {
        ctx.updateMediaFilePlayback();
    }, 10000);
    this.initializeVideoData();
  }

  ngOnDestroy(): void {
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
    if(this.updateMediaFilePlaybackInterval)
    {
      window.clearInterval(this.updateMediaFilePlaybackInterval);
    }
    if(this.customMouseOutEvent)
    {
      window.removeEventListener('click',this.customMouseOutEvent);
    }
    if(this.beforeUnloadFunction)
    {
      window.removeEventListener('beforeunload',this.beforeUnloadFunction);
    }
  }

  public initializeVideoData(){
    this.sharedService.listProcessGUIDs.push(this.builderVideo.TranscodePrepareVideo.ProcessGUID);
    this.builderVideo.LoadStatus=LoadVideoStatus.Empty;
    let url=this.builderVideo.TranscodePrepareVideo.MediaServerUrl+"/api/transcodeVideos/GetVideoData";
    this.restProvider.executeHttpMethodByUrl(HttpMethodType.POST,url,this.builderVideo.TranscodePrepareVideo).then((response) => {
      this.builderVideo.LoadStatus=LoadVideoStatus.Generated;
      const jsonString=hiBase64.decode(response);
      let transcodeRunVideo:TranscodeRunVideo=JSON.parse(jsonString);
      this.builderVideo.TranscodeRunVideo=transcodeRunVideo;
      this.builderVideo.TranscodePrepareVideo=transcodeRunVideo.TranscodePrepareVideo;
      this.initializeStreams();
      setTimeout(() => {
        this.executeHideControls();
      }, 1000);
      this.onInitializeVideo();
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
    let duration=this.builderVideo.TranscodePrepareVideo.TotalSeconds;
    let currentTime=(percentajeCurrentTime*duration/percentajeDuration);
    this.lastTmpVideoTime=currentTime;
  }

  public onTouchMoveSlider(event:any,sliderContainer:any,controlLeft:any){
    if(sliderContainer.startMove)
    {
      let percentajeCurrentTime=((event.changedTouches[0].clientX-controlLeft.offsetWidth-8-4)/(sliderContainer.offsetWidth))*100;
      let percentajeDuration=100;
      let duration=this.builderVideo.TranscodePrepareVideo.TotalSeconds;
      let currentTime=(percentajeCurrentTime*duration/percentajeDuration);
      this.lastTmpVideoTime=currentTime;
    }
  }

  public goToNextEpisode(){
    if(this.builderVideo.TranscodePrepareVideo && this.builderVideo.ItemDetail.ListSeasons && this.builderVideo.ItemDetail.ListSeasons.length>0 && this.builderVideo.ItemDetail.CurrentSeason)
    {
      let currentSeasonNumber=this.builderVideo.ItemDetail.CurrentSeason.SeasonNumber;
      let currentEpisodeNumber=this.builderVideo.ItemDetail.CurrentEpisode.EpisodeNumber;
      let nextEpisodeNumber=currentEpisodeNumber+1;
      let index=this.builderVideo.ItemDetail.CurrentSeason.ListEpisodes.findIndex(item=>item.EpisodeNumber==nextEpisodeNumber);
      if(index!=-1)
      {
        let nextEpisode=this.builderVideo.ItemDetail.CurrentSeason.ListEpisodes[index];
        this.getVideoByEpisode(nextEpisode);
      }else{
        let nextSeasonNumber=currentSeasonNumber+1;
        let index=this.builderVideo.ItemDetail.ListSeasons.findIndex(item=>item.SeasonNumber==nextSeasonNumber);
        if(index!=-1)
        {
          let nextSeason=this.builderVideo.ItemDetail.ListSeasons[index];
          this.builderVideo.ItemDetail.CurrentSeason=nextSeason;
          if(nextSeason && nextSeason.ListEpisodes && nextSeason.ListEpisodes.length){
            let nextEpisode=nextSeason.ListEpisodes[0];
            this.getVideoByEpisode(nextEpisode);
          }
        }
      }
    }
  }

  public getVideoByEpisode(episode:MediaEpisode){
    this.deleteAllProcessesAndDirectories();
    var mediaServer=this.sharedService.mediaServers.find(x=>x.Id==this.builderVideo.TranscodePrepareVideo.MediaServerId);
    var transcodeVideo=this.libraryService.GetTranscodeVideoFromEpisode(this.builderVideo.ItemDetail,episode,mediaServer);
    this.builderVideo.TranscodePrepareVideo=transcodeVideo;
    if(this.builderVideo.ItemDetail.ListSeasons)
    {
      this.builderVideo.ItemDetail.CurrentSeason=this.builderVideo.ItemDetail.ListSeasons.find(item=>item.SeasonNumber==episode.SeasonNumber);
      this.builderVideo.ItemDetail.CurrentEpisode=this.builderVideo.ItemDetail.CurrentSeason.ListEpisodes.find(item=>item.EpisodeNumber==episode.EpisodeNumber);
    }
    this.lastRealVideoTime=0;
    this.resetStream();
    this.sharedService.listProcessGUIDs.push(this.builderVideo.TranscodePrepareVideo.ProcessGUID);
    this.builderVideo.LoadStatus=LoadVideoStatus.Empty;
    let url=this.builderVideo.TranscodePrepareVideo.MediaServerUrl+"/api/transcodeVideos/GetVideoData";
    this.restProvider.executeHttpMethodByUrl(HttpMethodType.POST,url,this.builderVideo.TranscodePrepareVideo).then((response) => {
      this.builderVideo.LoadStatus=LoadVideoStatus.Generated;
      const jsonString=hiBase64.decode(response);
      let transcodeRunVideo:TranscodeRunVideo=JSON.parse(jsonString);
      this.builderVideo.TranscodeRunVideo=transcodeRunVideo;
      this.builderVideo.TranscodePrepareVideo=transcodeRunVideo.TranscodePrepareVideo;
      this.initializeStreams();
      this.getVideoSource();
    },error=>{
      this.showLoadVideoErrorActionsDialog();
      console.error(error);
    });
  }

  public goToPreviousEpisode(){
    if(this.builderVideo.TranscodePrepareVideo && this.builderVideo.ItemDetail.ListSeasons && this.builderVideo.ItemDetail.ListSeasons.length>0 && this.builderVideo.ItemDetail.CurrentSeason)
    {
      let currentSeasonNumber=this.builderVideo.ItemDetail.CurrentSeason.SeasonNumber;
      let currentEpisodeNumber=this.builderVideo.ItemDetail.CurrentEpisode.EpisodeNumber;
      let previousEpisodeNumber=currentEpisodeNumber-1;
      let index=this.builderVideo.ItemDetail.CurrentSeason.ListEpisodes.findIndex(item=>item.EpisodeNumber==previousEpisodeNumber);
      if(index!=-1)
      {
        let previousEpisode=this.builderVideo.ItemDetail.CurrentSeason.ListEpisodes[index];
        this.getVideoByEpisode(previousEpisode);
      }else{
        let previousSeasonNumber=currentSeasonNumber+1;
        let index=this.builderVideo.ItemDetail.ListSeasons.findIndex(item=>item.SeasonNumber==previousSeasonNumber);
        if(index!=-1)
        {
          let previousSeason=this.builderVideo.ItemDetail.ListSeasons[index];
          this.builderVideo.ItemDetail.CurrentSeason=previousSeason;
          if(previousSeason && previousSeason.ListEpisodes && previousSeason.ListEpisodes.length){
            let previousEpisode=previousSeason.ListEpisodes[previousSeason.ListEpisodes.length-1];
            this.getVideoByEpisode(previousEpisode);
          }
        }
      }
    }
  }

  public isEnablePreviousEpisodeButton(){
    if(this.builderVideo.TranscodePrepareVideo && this.builderVideo.ItemDetail.ListSeasons && this.builderVideo.ItemDetail.ListSeasons.length>0 && this.builderVideo.ItemDetail.CurrentSeason)
    {
      let currentSeasonNumber=this.builderVideo.ItemDetail.CurrentSeason.SeasonNumber;
      let currentEpisodeNumber=this.builderVideo.ItemDetail.CurrentEpisode.EpisodeNumber;
      let nextEpisodeNumber=currentEpisodeNumber-1;
      let index=this.builderVideo.ItemDetail.CurrentSeason.ListEpisodes.findIndex(item=>item.EpisodeNumber==nextEpisodeNumber);
      if(index!=-1)
      {
        return true;
      }else{
        let nextSeasonNumber=currentSeasonNumber-1;
        let index=this.builderVideo.ItemDetail.ListSeasons.findIndex(item=>item.SeasonNumber==nextSeasonNumber);
        if(index!=-1)
        {
          let previousSeason=this.builderVideo.ItemDetail.ListSeasons[index];
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
    if(this.builderVideo.TranscodePrepareVideo && this.builderVideo.ItemDetail.ListSeasons && this.builderVideo.ItemDetail.ListSeasons.length>0 && this.builderVideo.ItemDetail.CurrentSeason)
    {
      let currentSeasonNumber=this.builderVideo.ItemDetail.CurrentSeason.SeasonNumber;
      let currentEpisodeNumber=this.builderVideo.ItemDetail.CurrentEpisode.EpisodeNumber;
      let nextEpisodeNumber=currentEpisodeNumber+1;
      let index=this.builderVideo.ItemDetail.CurrentSeason.ListEpisodes.findIndex(item=>item.EpisodeNumber==nextEpisodeNumber);
      if(index!=-1)
      {
        return true;
      }else{
        let nextSeasonNumber=currentSeasonNumber+1;
        let index=this.builderVideo.ItemDetail.ListSeasons.findIndex(item=>item.SeasonNumber==nextSeasonNumber);
        if(index!=-1)
        {
          let nextSeason=this.builderVideo.ItemDetail.ListSeasons[index];
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

  public showSubtitle(){

  }

  public closeVideo(){
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    this.deleteAllProcessesAndDirectories();
    this.outputCloseVideo.emit(true);
  }

  public focusButton(button:any){
    button.focus();
    this.sharedService.currentSelectedElement=button;
  }

  ngAfterViewInit(){

  }

  public getConfirmMessage():string{
    var status="Vacio";
    switch (this.builderVideo.LoadStatus) {

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
    if(this.builderVideo.TranscodePrepareVideo.ListAudioStreams && this.builderVideo.TranscodePrepareVideo.ListAudioStreams.length>0)
    {
      this.builderVideo.TranscodePrepareVideo.ListAudioStreams.forEach(element => {
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
      this.listPrincipalSettingsOptions[0].listOptions=this.builderVideo.TranscodePrepareVideo.ListAudioStreams;
      this.listPrincipalSettingsOptions[0].selectedOption=this.builderVideo.TranscodePrepareVideo.ListAudioStreams.find(audio=>audio.isDefault==true);
    }
    if(this.builderVideo.TranscodePrepareVideo.ListSubtitlesStreams && this.builderVideo.TranscodePrepareVideo.ListSubtitlesStreams.length>0)
    {
      this.builderVideo.TranscodePrepareVideo.ListSubtitlesStreams.forEach(element => {
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
      listSubtitlesStreams=listSubtitlesStreams.concat(this.builderVideo.TranscodePrepareVideo.ListSubtitlesStreams);
      this.listPrincipalSettingsOptions[1].listOptions=listSubtitlesStreams;
      let selectedSubtitle =this.builderVideo.TranscodePrepareVideo.ListSubtitlesStreams.find(subt=>subt.isDefault==true);
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
    if(this.builderVideo.TranscodePrepareVideo.CurrentTime!=undefined)
    {
      this.lastRealVideoTime=this.builderVideo.TranscodePrepareVideo.CurrentTime;
    }else{
      this.lastRealVideoTime=0;
    }
  }

  public updateMediaFilePlayback(){
    if(this.builderVideo.TranscodePrepareVideo.TotalSeconds!=undefined){
      var currentTime=0;
      if(this.getCurrentVideoTime()>0 && this.getCurrentVideoTime()<=this.builderVideo.TranscodePrepareVideo.TotalSeconds)
      {
        currentTime=this.getCurrentVideoTime();
        if(currentTime-20<0)
        {
          currentTime=0;
        }else{
          currentTime=currentTime-20;
        }
      }
      let mediaFilePlayback:MediaFilePlayback={
        Title:this.builderVideo.TranscodePrepareVideo.Title,
        MediaFileId:this.builderVideo.TranscodePrepareVideo.VideoId,
        ProfileId:this.sharedService.currentProfile.Id,
        DurationTime:this.builderVideo.TranscodePrepareVideo.TotalSeconds,
        CurrentTime:currentTime
      }
      if(this.builderVideo.TranscodePrepareVideo.Subtitle)
      {
        mediaFilePlayback.Subtitle=this.builderVideo.TranscodePrepareVideo.Subtitle;
      }
      if(this.builderVideo.ItemDetail.CurrentSeason)
      {
        mediaFilePlayback.SeasonNumber=this.builderVideo.ItemDetail.CurrentSeason.SeasonNumber;
      }
      if(this.builderVideo.ItemDetail.CurrentEpisode)
      {
        mediaFilePlayback.EpisodeNumber=this.builderVideo.ItemDetail.CurrentEpisode.EpisodeNumber;
      }
      this.libraryService.updateMediaFilePlayback(this.builderVideo.TranscodePrepareVideo.MediaServerUrl,mediaFilePlayback).then((response) => {

      },error=>{
        console.error(error);
      });
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
    if(this.builderVideo.TranscodePrepareVideo && this.builderVideo.TranscodePrepareVideo.TotalSeconds)
    {
      return this.getFormatTime(this.builderVideo.TranscodePrepareVideo.TotalSeconds);
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
  let duration=this.builderVideo.TranscodePrepareVideo.TotalSeconds;
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

  public updateVideoData(newVideoTime:number){
    this.deleteAllProcessesAndDirectories();
    let processGUID=uuid();
    this.sharedService.listProcessGUIDs.push(processGUID);
    this.builderVideo.TranscodePrepareVideo.TimeSpan=newVideoTime.toString();
    this.builderVideo.TranscodePrepareVideo.ProcessGUID=processGUID;
    this.builderVideo.LoadStatus=LoadVideoStatus.Empty;
    let url=this.builderVideo.TranscodePrepareVideo.MediaServerUrl+"/api/transcodeVideos/UpdateVideoData";
    this.restProvider.executeHttpMethodByUrl(HttpMethodType.POST,url,this.builderVideo.TranscodePrepareVideo).then((response) => {
      this.builderVideo.LoadStatus=LoadVideoStatus.Generated;
      const jsonString=hiBase64.decode(response);
      let transcodeRunVideo:TranscodeRunVideo=JSON.parse(jsonString);
      this.builderVideo.TranscodeRunVideo=transcodeRunVideo;
      this.updateAudioAndVideoList();
      this.getVideoSource();
    },error=>{
      this.showLoadVideoErrorActionsDialog();
      console.error(error);
    });
  }

  public deleteAllProcessesAndDirectories(){
    if(this.sharedService.listProcessGUIDs && this.sharedService.listProcessGUIDs.length>0)
    {
      this.deleteProcessesAndDirectories();
    }
  }

  public deleteProcessesAndDirectories(){
    var guids=this.sharedService.listProcessGUIDs.join(",");
    let url=this.builderVideo.TranscodePrepareVideo.MediaServerUrl+"/api/transcodeVideos?guids="+guids;
    this.restProvider.executeHttpMethodByUrl(HttpMethodType.DELETE,url).then((response) => {
      const jsonString=hiBase64.decode(response);
      let listProcessDeletedGUIDs:string[]=JSON.parse(jsonString);
      if(listProcessDeletedGUIDs && listProcessDeletedGUIDs.length>0 && this.sharedService.listProcessGUIDs.length>0)
      {
        for(var i=0;i<listProcessDeletedGUIDs.length;i++)
        {
          let processDeletedGUID=listProcessDeletedGUIDs[i];
          let index=this.sharedService.listProcessGUIDs.findIndex(item=>item==processDeletedGUID);
          if(index!=-1)
          {
            this.sharedService.listProcessGUIDs.splice(index,1);
          }
        }
      }
    },error=>{
      console.error(error);
    });
  }


  public getSliderPogressWidth(){
    if(this.builderVideo.TranscodePrepareVideo && this.builderVideo.TranscodePrepareVideo.TotalSeconds)
    {
      let duration=this.builderVideo.TranscodePrepareVideo.TotalSeconds;
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
    if(this.builderVideo.TranscodePrepareVideo && this.builderVideo.TranscodePrepareVideo.VideoTransmissionTypeId==VideoTransmissionType.MPEGDASH)
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

    if(this.builderVideo.TranscodePrepareVideo && this.builderVideo.TranscodePrepareVideo.VideoTransmissionTypeId==VideoTransmissionType.MPEGDASH)
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
            bufferPruningInterval:this.builderVideo.TranscodePrepareVideo.TotalSeconds,
            bufferToKeep:this.builderVideo.TranscodePrepareVideo.TotalSeconds
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


  public onInitializeVideo(){
    this.executeInitializeVideo();
  }

  public getCurrentVideoTime(){
    if(this.builderVideo.TranscodePrepareVideo && this.builderVideo.TranscodePrepareVideo.VideoTransmissionTypeId==VideoTransmissionType.MPEGDASH)
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
    this.builderVideo.LoadStatus=LoadVideoStatus.LoadedMetada;
    console.log("onLoadedMetadata");
  }

  public onLoadedData(){
    console.log("onLoadedData");
    this.builderVideo.LoadStatus=LoadVideoStatus.LoadedData;
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

  public executeInitializeVideo(){
    this.getVideoSource();
  }

  public testAnyVideo(){

  }

  public getVideoSource(){
    this.http.get(this.builderVideo.TranscodeRunVideo.VideoPath,{headers:undefined, responseType: 'blob' as 'json' }).subscribe((response:any) => {
      this.builderVideo.LoadStatus=LoadVideoStatus.Initialized;
      this.showVideoTarget=true;
      this.ref.detectChanges();
      if(this.builderVideo.TranscodeRunVideo.VideoPath.indexOf("mpd")!=-1)
      {
          this.displayVideoUsingDash(this.builderVideo.TranscodeRunVideo.VideoPath);
      }else if(this.builderVideo.TranscodeRunVideo.VideoPath.indexOf("m3u8")!=-1)
      {
        this.displayVideoUsingHLS(this.builderVideo.TranscodeRunVideo.VideoPath);
      }else{
        this.videoTarget.nativeElement.src=this.builderVideo.TranscodeRunVideo.VideoPath;
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
    setTimeout(() => {
      if(ctx.builderVideo.LoadStatus!=LoadVideoStatus.LoadedData)
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
        this.updateVideoData(currentVideoTime);
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
    if(this.builderVideo.TranscodePrepareVideo && this.builderVideo.TranscodePrepareVideo.VideoTransmissionTypeId==VideoTransmissionType.MPEGDASH)
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
    if(this.getCurrentVideoTime()<this.builderVideo.TranscodePrepareVideo.TotalSeconds)
    {
      let seconsToAdd=0;
      if(this.getCurrentVideoTime()+maxSecondsToAdd>this.builderVideo.TranscodePrepareVideo.TotalSeconds)
      {
        if(this.builderVideo.TranscodePrepareVideo.TotalSeconds>this.getCurrentVideoTime())
        {
          seconsToAdd=this.builderVideo.TranscodePrepareVideo.TotalSeconds-this.getCurrentVideoTime();
        }else{
          seconsToAdd=0;
        }
      }else{
        seconsToAdd=maxSecondsToAdd;
      }
      if(this.builderVideo.TranscodePrepareVideo && this.builderVideo.TranscodePrepareVideo.VideoTransmissionTypeId==VideoTransmissionType.MPEGDASH)
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
