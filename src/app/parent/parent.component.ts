import { ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { HttpMethodType } from 'src/app/shared/enums';
import {v4 as uuid} from "uuid";
import { SinovadApiGenericResponse } from '../response/sinovadApiGenericResponse';
import { FormGroup } from '@angular/forms';
import { FormatDataPipe } from '../shared/pipes/format-data.pipe';
import { Item } from '../media/shared/item.model';
import { ItemDetail } from '../media/shared/item-detail.model';
import { Episode } from '../episodes/shared/episode.model';
import { TranscodePrepareVideo } from '../media/video/models/transcodePrepareVideo';
import { BuilderVideo } from '../media/video/models/builderVideo';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css']
})

export class ParentComponent implements OnInit {

  constructor(
    public restProvider: RestProviderService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {}

  ngOnInit(): void {

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
          this.sharedData.apiToken=undefined;
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
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/mediaServers/GetAllByUserAsync/'+this.sharedData.userData.Id).then((response:SinovadApiGenericResponse) => {
        let mediaServers=response.Data;
        this.sharedData.mediaServers=mediaServers;
        this.checkSecureConnectionMediaServers();
        resolve(true);
      },error=>{
        reject(error);
      });
    });
  }

  public checkSecureConnectionMediaServers(){
    if(this.sharedData.mediaServers!=null && this.sharedData.mediaServers.length>0)
    {
      this.sharedData.mediaServers.forEach(mediaServer => {
        this.restProvider.executeHttpMethodByUrl(HttpMethodType.GET,mediaServer.Url+"/api").then((response) => {
            mediaServer.isSecureConnection=true;
            if(this.sharedData.selectedMediaServer==undefined)
            {
              this.sharedData.selectedMediaServer=this.sharedData.mediaServers.find(ele=>ele.Id==mediaServer.Id);
            }
        },error=>{
          mediaServer.isSecureConnection=false;
        });
      });
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

