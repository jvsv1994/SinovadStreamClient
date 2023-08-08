import { Injectable } from '@angular/core';
import { User } from 'src/app/users/shared/user.model';
import { Menu } from 'src/app/menus/shared/menu.model';
import { Profile } from 'src/app/profiles/shared/profile.model';
import { Configuration } from '../models/configuration.model';
import { MediaServer } from 'src/app/servers/shared/server.model';
import { FormGroup } from '@angular/forms';
import { ItemDetail } from 'src/app/media/shared/item-detail.model';
import { Item } from 'src/app/media/shared/item.model';
import { RestProviderService } from './rest-provider.service';
import {v4 as uuid} from "uuid";
import { TranscodePrepareVideo } from 'src/app/media/video/models/transcodePrepareVideo';
import { BuilderVideo } from 'src/app/media/video/models/builderVideo';
import { Episode } from 'src/app/episodes/shared/episode.model';
import { HttpMethodType } from '../enums';
import { SinovadApiGenericResponse } from 'src/app/response/sinovadApiGenericResponse';

@Injectable({ providedIn: 'root' })
export class SharedDataService {

  showSplashScreen:boolean=true;
  userData: User;
  //urlSinovadStreamWebApi: string='http://localhost:53363';
  urlSinovadStreamWebApi: string='https://streamapi.sinovad.com';
  urlSinovadCdn: string='https://resources.sinovad.com/stream/web';
  originalUrlImagesMovieDataBase:String="https://image.tmdb.org/t/p/w600_and_h900_bestv2";
  urlEpisodeDataBase:string="https://www.themoviedb.org/t/p/w454_and_h254_bestv2";
  currentSelectedElement:any;
  currentActiveSection:any;
  listProcessGUIDs:String[]=[];
  apiToken:string;
  currentProfile:any;
  configurationData:Configuration=new Configuration();
  listProfiles:Profile[]=[];
  listMenus:Menu[]=[];
  pageNotFoundShowing:boolean=false;
  mediaServers:MediaServer[]=[];
  selectedMediaServer:MediaServer;

  constructor(public restProvider:RestProviderService) {

  }

  //auxiliary methods

  public formatDate(date:any) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }


  public getInitials(profile:any){
    let initial=profile.FullName.substring(0,1);
    return initial;
  }

  public delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  public hasRequireErrorFormControl(formGroup:FormGroup,formControlKey:string){
    if(formGroup.controls[formControlKey].errors.required)
    {
      return true;
    }else{
      return false;
    }
  }

  public isInvalidFormControl(formGroup:FormGroup,formControlKey:string){
    if(formGroup.controls[formControlKey].invalid && (formGroup.controls[formControlKey].dirty || formGroup.controls[formControlKey].touched))
    {
      return true;
    }else{
      return false;
    }
  }

  public hasErrorPatternFormControl(formGroup:FormGroup,formControlKey:string){
    if(formGroup.controls[formControlKey].errors.pattern)
    {
      return true;
    }else{
      return false;
    }
  }


  public CreateBuilderVideoFromItem(item:Item,detail:ItemDetail):BuilderVideo{
    let processGUID=uuid();
    var transcodeVideo= new TranscodePrepareVideo();
    transcodeVideo.VideoId=item.VideoId;
    transcodeVideo.Title=item.Subtitle?item.Title+" "+item.Subtitle:item.Title;
    transcodeVideo.PhysicalPath=item.PhysicalPath;
    transcodeVideo.MediaServerId=item.MediaServerId;
    transcodeVideo.MediaServerUrl=item.MediaServerUrl;
    transcodeVideo.CurrentTime=item.CurrentTime;
    transcodeVideo.ProcessGUID=processGUID;
    if(transcodeVideo.CurrentTime)
    {
      transcodeVideo.TimeSpan=transcodeVideo.CurrentTime.toString();
    }else{
      transcodeVideo.TimeSpan="0";
    }
    if(detail.ListSeasons)
    {
      detail.CurrentSeason=detail.ListSeasons.find(season=>season.SeasonNumber==item.SeasonNumber);
      detail.CurrentEpisode=detail.CurrentSeason.ListEpisodes.find(ep=>ep.EpisodeNumber==item.EpisodeNumber);
    }
    var builderVideo= new BuilderVideo();
    builderVideo.TranscodePrepareVideo=transcodeVideo;
    builderVideo.ItemDetail=detail;
    return builderVideo;
  }

  public CreateBuilderVideoFromEpisode(episode:Episode,detail:ItemDetail):BuilderVideo{
    var transcodeVideo:TranscodePrepareVideo=this.GetTranscodeVideoFromEpisode(episode);
    if(detail.ListSeasons)
    {
      detail.CurrentSeason=detail.ListSeasons.find(item=>item.SeasonNumber==episode.SeasonNumber);
      detail.CurrentEpisode=detail.CurrentSeason.ListEpisodes.find(item=>item.EpisodeNumber==episode.EpisodeNumber);
    }
    var builderVideo= new BuilderVideo();
    builderVideo.TranscodePrepareVideo=transcodeVideo;
    builderVideo.ItemDetail=detail;
    return builderVideo;
  }

  public GetTranscodeVideoFromEpisode(episode:Episode):TranscodePrepareVideo{
    let processGUID=uuid();
    var transcodeVideo= new TranscodePrepareVideo();
    transcodeVideo.VideoId=episode.VideoId;
    transcodeVideo.Title=episode.TvSerieName+" "+"T"+episode.SeasonNumber+":E"+episode.EpisodeNumber+" "+episode.Name;
    transcodeVideo.PhysicalPath=episode.PhysicalPath;
    transcodeVideo.MediaServerId=episode.MediaServerId;
    transcodeVideo.MediaServerUrl=episode.MediaServerUrl;
    transcodeVideo.ProcessGUID=processGUID;
    transcodeVideo.CurrentTime=0;
    if(transcodeVideo.CurrentTime)
    {
      transcodeVideo.TimeSpan=transcodeVideo.CurrentTime.toString();
    }else{
      transcodeVideo.TimeSpan="0";
    }
    return transcodeVideo;
  }

  public getUser(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/users/GetUserData').then((response:SinovadApiGenericResponse) => {
        let data=response.Data;
        this.userData=data;
        if(this.userData==null)
        {
          this.apiToken=undefined;
          localStorage.removeItem("apiToken");
        }else{
          resolve(true);
        }
      },error=>{
        console.error(error);
        reject(error)
      });
    });
  }


  public getMediaServers(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/mediaServers/GetAllByUserAsync/'+this.userData.Id).then((response:SinovadApiGenericResponse) => {
        let mediaServers=response.Data;
        this.mediaServers=mediaServers;
        this.checkSecureConnectionMediaServers();
        resolve(true);
      },error=>{
        reject(error);
      });
    });
  }

  public checkSecureConnectionMediaServers(){
    if(this.mediaServers!=null && this.mediaServers.length>0)
    {
      this.mediaServers.forEach(mediaServer => {
        this.restProvider.executeHttpMethodByUrl(HttpMethodType.GET,mediaServer.Url+"/api").then((response) => {
            mediaServer.isSecureConnection=true;
            if(this.selectedMediaServer==undefined)
            {
              this.selectedMediaServer=this.mediaServers.find(ele=>ele.Id==mediaServer.Id);
            }
        },error=>{
          mediaServer.isSecureConnection=false;
        });
      });
    }
  }

  public getProfiles(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/profiles/GetAllWithPaginationByUserAsync/'+this.userData.Id).then((response:SinovadApiGenericResponse) => {
        let listProfiles=response.Data;
        this.listProfiles=listProfiles;
        this.currentProfile=listProfiles[0];
        resolve(true);
      },error=>{
        reject(error);
      });
    });
  }

  public getMenus(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/menus/GetByUserAsync/'+this.userData.Id).then((response:SinovadApiGenericResponse) => {
        this.listMenus=response.Data;
        resolve(true);
      },error=>{
        reject(error);
      });
    });
  }

  public isSmallDevice(){
    if(window.innerWidth<=768)
    {
      return true;
    }else{
      return false;
    }
  }

  public isMobileDevice(){
    if(('ontouchstart' in window))
    {
      return true;
    }else{
      return false;
    }
  }

  public getUrlByItemDetailMovieDataBase(item:ItemDetail){
    if(item.TmdbId!=undefined && item.TmdbId>0)
    {
      return this.originalUrlImagesMovieDataBase+item.PosterPath;
    }else{
      return item.PosterPath;
    }
  }

  public getUrlByItemMovieDataBase(item:Item){
    if(item.TmdbId!=undefined && item.TmdbId>0)
    {
      return this.originalUrlImagesMovieDataBase+item.PosterPath;
    }else{
      return item.PosterPath;
    }
  }

  public getYearByDateFormat(releaseDate:any){
    var releaseDateConverted = new Date(releaseDate);
    return releaseDateConverted.getFullYear();
  }

  public sort_by(field, reverse, primer) {
    let key = primer ? (x) => primer(x[field]) : (x) => x[field];
    reverse = !reverse ? 1 : -1;
    return (a, b) => { return a = key(a), b = key(b), reverse * (+(a > b) - +(b > a)) }
  }

  public validateEmailFormat(email: string): boolean {
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }

}
