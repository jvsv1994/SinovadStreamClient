import { ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { RestProviderService } from 'src/services/rest-provider.service';
import { CatalogEnum, HttpMethodType, MediaServerState } from '../enums';
import { MediaServer } from '../../models/mediaServer';
import { Item } from '../../models/item';
import { ItemDetail } from '../../models/itemDetail';
import { BuilderVideo } from '../../models/builderVideo';
import { Episode } from '../../models/episode';
import {v4 as uuid} from "uuid";
import { TranscodePrepareVideo } from '../../models/transcodePrepareVideo';
import { SinovadApiGenericResponse } from '../response/sinovadApiGenericResponse';
import { FormatDataPipe } from 'src/pipes/format-data.pipe';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css']
})

export class ParentComponent implements OnInit {

  fdp: FormatDataPipe = new FormatDataPipe(this.domSanitizer,this.sharedData);
  constructor(
    public restProvider: RestProviderService,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {}

  ngOnInit(): void {

  }

  public getNewIndex(itemIndex:number,pageIndex:number,pageSize:number){
    var newIndex=(itemIndex+1)+((pageIndex-1)*pageSize);
    return newIndex;
  }

  public delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  public getTargetNumberValue(target:any):number{
    if(target.value)
    {
      return Number(target.value);
    }else{
      return 0;
    }
  }

  public getTargetDateValue(target:any):any{
    return target.valueAsDate;
  }

  public getTargetValue(target:any):any{
    return target.value;
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
        this.sharedData.userData=data;
        if(this.sharedData.userData==null)
        {
          this.sharedData.currentToken=undefined;
          localStorage.removeItem("apiKey");
        }else{
          if(this.sharedData.configurationData.localIpAddress)
          {
            var path="/mediaServers/GetByUserAndIpAddressAsync?userId="+this.sharedData.userData.Id+"&ipAddress="+this.sharedData.configurationData.localIpAddress;
            this.restProvider.executeSinovadApiService(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
              let data=response.Data;
              this.sharedData.selectedMediaServer=data;
              if(this.sharedData.selectedMediaServer==undefined)
              {
                this.saveMediaServer();
              }else{
                if(this.sharedData.configurationData.localIpAddress)
                {
                  this.saveApiKeyInMediaStreamHost();
                }
              }
              resolve(true);
            },error=>{
              console.error(error);
              reject(error)
            });
          }else{
            resolve(true);
          }
        }
      },error=>{
        console.error(error);
        reject(error)
      });
    });
  }


  public getMediaServers(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/mediaServers/GetAllByUserAsync/'+this.sharedData.userData.Id).then((response:SinovadApiGenericResponse) => {
        let mediaServers=response.Data;
        this.sharedData.mediaServers=mediaServers;
        if(this.sharedData.mediaServers && this.sharedData.mediaServers.length>0)
        {
          this.sharedData.selectedMediaServer=this.sharedData.mediaServers[0];
        }
        resolve(true);
      },error=>{
        reject(error);
      });
    });
  }

  public validateMediaServer(mediaServerGuid:string){
    if(this.sharedData.mediaServers && this.sharedData.mediaServers.length>0)
    {
      var index=this.sharedData.mediaServers.findIndex(x=>x.Guid==mediaServerGuid);
      if(index!=-1)
      {
        this.sharedData.selectedMediaServer=this.sharedData.mediaServers[index];
        return true;
      }else{
        return false;
      }
    }
  }

  public getMediaServer(mediaServerGuid:string){
    if(this.sharedData.mediaServers && this.sharedData.mediaServers.length>0)
    {
      var index=this.sharedData.mediaServers.findIndex(x=>x.Guid==mediaServerGuid);
      if(index!=-1)
      {
        this.sharedData.selectedMediaServer=this.sharedData.mediaServers[index];
        return true;
      }else{
        return false;
      }
    }
  }

  public getProfiles(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/profiles/GetAllWithPaginationByUserAsync/'+this.sharedData.userData.Id).then((response:SinovadApiGenericResponse) => {
        let listProfiles=response.Data;
        this.sharedData.listProfiles=listProfiles;
        this.sharedData.currentProfile=listProfiles[0];
        resolve(true);
      },error=>{
        reject(error);
      });
    });
  }

  public getMenus(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/menus/GetByUserAsync/'+this.sharedData.userData.Id).then((response:SinovadApiGenericResponse) => {
        this.sharedData.listMenus=response.Data;
        resolve(true);
      },error=>{
        reject(error);
      });
    });
  }

  public saveMediaServer(){
    let acountServer:MediaServer={
      UserId:this.sharedData.userData.Id,
      IpAddress:this.sharedData.configurationData.localIpAddress,
      Url:this.sharedData.configurationData.currentHost,
      StateCatalogId:CatalogEnum.MediaServerState,
      StateCatalogDetailId:MediaServerState.Stopped
    }
    this.restProvider.executeSinovadApiService(HttpMethodType.POST,"/mediaServers/Create",acountServer).then((response) => {
      var path="/mediaServers/GetByUserAndIpAddressAsync?userId="+this.sharedData.userData.Id+"&ipAddress="+this.sharedData.configurationData.localIpAddress;
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        let data=response.Data;
        this.sharedData.selectedMediaServer=data;
        if(this.sharedData.configurationData.currentHost)
        {
          this.saveApiKeyInMediaStreamHost();
        }
      },error=>{
        console.error(error);
      });
    },error=>{
      console.error(error);
    });
  }

  public saveApiKeyInMediaStreamHost(){
    let mediaServerData={
      ApiKey:this.sharedData.currentToken,
      MediaServer:this.sharedData.selectedMediaServer
    }
    this.restProvider.executeSinovadStreamServerService(HttpMethodType.POST,'/main/SaveMediaServerData',mediaServerData).then((response) => {

    },error=>{
      console.error(error);
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

  public getInitials(profile:any){
    let initial=profile.FullName.substring(0,1);
    return initial;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {

  }

  public isMobileDevice(){
    if(('ontouchstart' in window))
    {
      return true;
    }else{
      return false;
    }
  }

  public checkIfShowDisableItemsButton(listSelectedItems:any[]){
    let listEnableSelectedItems:any[]=listSelectedItems.filter(item=>item.Active);
    if(listEnableSelectedItems.length==listSelectedItems.length)
    {
      return true;
    }else{
      return false;
    }
  }

  public focusContainer(container:any,ref:ChangeDetectorRef){
      let listSections=Array.from<any>(container.querySelectorAll("section"));
      if(listSections && listSections.length>0)
      {
        let listElements=Array.from<any>(container.querySelectorAll("input,button,section"));
        if(listElements && listElements.length>0 && document.activeElement)
        {
          let index=listElements.indexOf(document.activeElement);
          if(index==-1)
          {
            let section=listSections[0];
            this.sharedData.currentActiveSection=section;
            section.focus();
          }
        }
      }else{
        let listElements=Array.from<any>(container.querySelectorAll("input,button,textarea"));
        if(listElements && listElements.length>0 && document.activeElement)
        {
          let index=listElements.indexOf(document.activeElement);
          if(index==-1)
          {
            this.sharedData.currentActiveSection=container;
            container.focus();
          }
        }else{
          this.sharedData.currentActiveSection=container;
          container.focus();
        }
      }
      ref.detectChanges();
  }


  public focusInElementInContainer(container:any,ref:ChangeDetectorRef){
    let listSections=Array.from<any>(container.querySelectorAll("section"));
    if(listSections && listSections.length>0)
    {
      let section=listSections[0];
      this.sharedData.currentActiveSection=section;
      let listElements=Array.from<any>(section.querySelectorAll("button"));
      if(listElements && listElements.length>0)
      {
        let element=listElements[0];
        this.sharedData.currentSelectedElement=element;
        element.focus();
        ref.detectChanges();
      }
    }else{
      this.sharedData.currentActiveSection=container;
      let listElements=Array.from<any>(container.querySelectorAll("button"));
      if(listElements && listElements.length>0)
      {
        let element=listElements[0];
        this.sharedData.currentSelectedElement=element;
        element.focus();
        ref.detectChanges();
      }
    }
  }

  public setKeyboardActionsSectionVerticalButtonsHorizontal(event:any,container:any,leftContainer:any,ref:ChangeDetectorRef,topContainer?:any){
    var keycode = event.keyCode;
    let listSections=Array.from<any>(container.nativeElement.querySelectorAll("section"));
    let sectionIndex=listSections.findIndex(item=>item.id==this.sharedData.currentActiveSection.id);
    let section=listSections[sectionIndex];
    if(section)
    {
      let listElements=Array.from<any>(section.querySelectorAll("button"));
      let numberElements=listElements.length;
      let elementIndex=listElements.findIndex(item=>item.id==this.sharedData.currentSelectedElement.id);
      if(keycode==39)//right
      {
        let newIndex=elementIndex+1;
        if(newIndex<numberElements)
        {
          let element=listElements[newIndex];
          element.focus();
          element.scrollIntoView({block:'center'});
          this.sharedData.currentSelectedElement=element;
          ref.detectChanges();
        }else{

        }
      }
      if(keycode==37)//left
      {
        let newIndex=elementIndex-1;
        if(newIndex>=0)
        {
          let element=listElements[newIndex];
          element.focus();
          this.sharedData.currentSelectedElement=element;
          element.scrollIntoView({block:'center'});
          ref.detectChanges();
        }else{
          if(leftContainer)
          {
            let listElements=Array.from<any>(leftContainer.nativeElement.querySelectorAll("input, button"));
            if(listElements && listElements.length>0)
            {
              this.sharedData.currentActiveSection=leftContainer;
              let element=listElements[0];
              this.sharedData.currentSelectedElement=element;
              element.focus();
            }
          }
        }
      }
      if(keycode==40)//down
      {
        let newSectionIdex=sectionIndex+1;
        if(newSectionIdex<listSections.length)
        {
          let section=listSections[newSectionIdex];
          this.sharedData.currentActiveSection=section
          let listElements=Array.from<any>(section.querySelectorAll("button"));
          let element=listElements[0];
          if(listElements[elementIndex])
          {
            element=listElements[elementIndex];
          }else{
            if(listElements[elementIndex-1])
            {
              element=listElements[elementIndex-1];
            }
          }
          element.scrollIntoView({block:'center'});
          this.sharedData.currentSelectedElement=element;
          element.focus();
        }
      }
      if(keycode==38)//up
      {
        let newSectionIdex=sectionIndex-1;
        if(newSectionIdex>=0)
        {
          let section=listSections[newSectionIdex];
          this.sharedData.currentActiveSection=section
          let listElements=Array.from<any>(section.querySelectorAll("button"));
          let element=listElements[0];
          if(listElements[elementIndex])
          {
            element=listElements[elementIndex];
          }else{
            if(listElements[elementIndex-1])
            {
              element=listElements[elementIndex-1];
            }
          }
          element.scrollIntoView({block:'center'});
          this.sharedData.currentSelectedElement=element;
          element.focus();
        }else{
          if(topContainer)
          {
            let listElements=Array.from<any>(topContainer.nativeElement.querySelectorAll("input, button"));
            if(listElements && listElements.length>0)
            {
              this.sharedData.currentActiveSection=topContainer;
              let element=listElements[0];
              if(listElements[elementIndex])
              {
                element=listElements[elementIndex];
              }else{
                if(listElements[elementIndex-1])
                {
                  element=listElements[elementIndex-1];
                }
              }
              this.sharedData.currentSelectedElement=element;
              element.focus();
            }
          }
        }
      }
    }
  }

  public focusFullScreenContainer(container:any,ref:ChangeDetectorRef){
    let listSections=Array.from<any>(container.querySelectorAll("section"));
    if(listSections && listSections.length>0)
    {
      let section=listSections[0];
      this.sharedData.currentActiveSection=section;
      section.focus();
      let listElements=Array.from<any>(section.querySelectorAll("input,button"));
      if(listElements && listElements.length>0)
      {
        let element=listElements[0];
        element.focus();
        this.sharedData.currentSelectedElement=element;
      }
    }
    ref.detectChanges();
  }

  public setKeyboardActionsFullScreenPage(event:any,container:any,ref:ChangeDetectorRef){
    var keycode = event.keyCode;
    let listSections=Array.from<any>(container.querySelectorAll("section"));
    let sectionIndex=listSections.findIndex(item=>item.id==this.sharedData.currentActiveSection.id);
    let section=listSections[sectionIndex];
    if(section)
    {
      let listElements=Array.from<any>(section.querySelectorAll("button,input"));
      let numberElements=listElements.length;
      let elementIndex=listElements.findIndex(item=>item.id==this.sharedData.currentSelectedElement.id);
      if(keycode==39)//right
      {
        let newIndex=elementIndex+1;
        if(newIndex<numberElements)
        {
          let element=listElements[newIndex];
          element.focus();
          element.scrollIntoView({block:'center'});
          this.sharedData.currentSelectedElement=element;
          ref.detectChanges();
        }else{

        }
      }
      if(keycode==37)//left
      {
        let newIndex=elementIndex-1;
        if(newIndex>=0)
        {
          let element=listElements[newIndex];
          element.focus();
          this.sharedData.currentSelectedElement=element;
          element.scrollIntoView({block:'center'});
          ref.detectChanges();
        }
      }
      if(keycode==40)//down
      {
        let newSectionIdex=sectionIndex+1;
        if(newSectionIdex<listSections.length)
        {
          let section=listSections[newSectionIdex];
          this.sharedData.currentActiveSection=section
          let listElements=Array.from<any>(section.querySelectorAll("button,input"));
          let element=listElements[0];
          if(listElements[elementIndex])
          {
            element=listElements[elementIndex];
          }else{
            if(listElements[elementIndex-1])
            {
              element=listElements[elementIndex-1];
            }
          }
          element.scrollIntoView({block:'center'});
          this.sharedData.currentSelectedElement=element;
          element.focus();
          if(element.nodeName.toUpperCase()=='INPUT')
          {
            element.click();
          }
        }
      }
      if(keycode==38)//up
      {
        let newSectionIdex=sectionIndex-1;
        if(newSectionIdex>=0)
        {
          let section=listSections[newSectionIdex];
          this.sharedData.currentActiveSection=section
          let listElements=Array.from<any>(section.querySelectorAll("button,input"));
          let element=listElements[0];
          if(listElements[elementIndex])
          {
            element=listElements[elementIndex];
          }else{
            if(listElements[elementIndex-1])
            {
              element=listElements[elementIndex-1];
            }
          }
          element.scrollIntoView({block:'center'});
          this.sharedData.currentSelectedElement=element;
          element.focus();
          if(element.nodeName.toUpperCase()=='INPUT')
          {
            element.click();
          }
        }
      }
    }
  }

  public getUrlByItemDetailMovieDataBase(item:ItemDetail){
    if(item.TmdbId!=undefined && item.TmdbId>0)
    {
      return this.sharedData.originalUrlImagesMovieDataBase+item.PosterPath;
    }else{
      return item.PosterPath;
    }
  }

  public getUrlByItemMovieDataBase(item:Item){
    if(item.TmdbId!=undefined && item.TmdbId>0)
    {
      return this.sharedData.originalUrlImagesMovieDataBase+item.PosterPath;
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

  public goToHeaderContainer(){
    let allContainers:any=Array.from(document.getElementsByClassName("sinovad-custom-container"));
    let indexHeader=allContainers.findIndex(container=>container.className.indexOf("sinovad-header-container")!=-1);
    if(indexHeader!=-1)
    {
      let headerContainer=allContainers[indexHeader];
      let auxiliaryContainers:any=Array.from(headerContainer.getElementsByClassName("sinovad-auxiliary-container"));
      if(auxiliaryContainers && auxiliaryContainers.length>0)
      {
        auxiliaryContainers[0].click();
      }
    }
  }

  public validateEmailFormat(email: string): boolean {
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }

}

