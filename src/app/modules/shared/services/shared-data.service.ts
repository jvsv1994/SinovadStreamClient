import { Injectable } from '@angular/core';
import { User } from 'src/app/modules/pages/users/shared/user.model';
import { Menu } from 'src/app/modules/pages/menus/shared/menu.model';
import { Profile } from 'src/app/modules/pages/profiles/shared/profile.model';
import { Configuration } from '../models/configuration.model';
import { MediaServer } from 'src/app/modules/pages/servers/shared/server.model';
import { FormGroup } from '@angular/forms';
import { LinkedAccount } from '../models/linked-account.model';
import { HubConnection } from '@microsoft/signalr';
import { MetadataAgents } from '../enums/enums';
import { Item } from '../../pages/media-items/models/item.model';

@Injectable({ providedIn: 'root' })
export class SharedService {

  showSplashScreen:boolean=true;
  userData: User;
  //urlSinovadStreamWebApi: string='http://localhost:53363';
  urlSinovadStreamWebApi: string='https://streamapi.sinovad.com';
  urlSinovadCdn: string='https://resources.sinovad.com/stream/web';
  originalUrlImagesMovieDataBase:String="https://image.tmdb.org/t/p/w600_and_h900_bestv2";
  urlEpisodeDataBase:string="https://www.themoviedb.org/t/p/w454_and_h254_bestv2";
  apiToken:string;
  currentProfile:Profile;
  configurationData:Configuration=new Configuration();
  listProfiles:Profile[]=[];
  manageMenus:Menu[]=[];
  mediaServers:MediaServer[]=[];
  linkedAccounts:LinkedAccount[]=[];
  hubConnection:HubConnection;
  platform:string;

  constructor() {

  }

  public checkIfIsEnableMenuOptionByPath(path:string){
    var findOption=false;
    for (let index = 0; index < this.manageMenus.length; index++) {
      const menu = this.manageMenus[index];
      if(menu.ChildMenus && menu.ChildMenus.findIndex(x=>x.Path && x.Path.includes(path))!=-1)
      {
        findOption=true;
        break;
      }
    }
    return findOption;
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

  public getUrlByItemMovieDataBase(item:Item){
    if(item.MetadataAgentsId==MetadataAgents.TMDb)
    {
      return this.originalUrlImagesMovieDataBase+item.PosterPath;
    }else{
      if(item.PosterPath)
      {
        return item.PosterPath;
      }else{
        var mediaServer=this.mediaServers.find(x=>x.Id==item.MediaServerId);
        if(mediaServer)
        {
          return mediaServer.Url+"/media/"+item.MediaFileGuid+"/thumbnail.png";
        }else{
          return "assets/img/no-image-available.jpg";
        }
      }
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

  public isHttpsSite(){
    if(window.location.origin.startsWith("https"))
    {
      return true;
    }else{
      return false;
    }
  }

}
