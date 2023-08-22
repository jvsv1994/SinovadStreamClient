import { Injectable } from '@angular/core';
import { User } from 'src/app/users/shared/user.model';
import { Menu } from 'src/app/menus/shared/menu.model';
import { Profile } from 'src/app/profiles/shared/profile.model';
import { Configuration } from '../models/configuration.model';
import { MediaServer } from 'src/app/servers/shared/server.model';
import { FormGroup } from '@angular/forms';
import { Library } from 'src/app/libraries/shared/library.model';
import { MetadataAgents } from '../enums';
import { ItemDetail } from 'src/app/media/shared/models/item-detail.model';
import { Item } from 'src/app/media/shared/models/item.model';
import { LinkedAccount } from '../models/linked-account.model';
import { HubConnection } from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })
export class SharedService {

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
  manageMenus:Menu[]=[];
  mediaMenu:Menu[]=[];
  pageNotFoundShowing:boolean=false;
  mediaServers:MediaServer[]=[];
  libraries:Library[]=[];
  selectedMediaServer:MediaServer;
  linkedAccounts:LinkedAccount[]=[];
  hubConnection:HubConnection;

  constructor() {

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

  public getUrlByItemDetailMovieDataBase(detail:ItemDetail){
    if(detail.MediaItem.MetadataAgentsId==MetadataAgents.TMDb)
    {
      return this.originalUrlImagesMovieDataBase+detail.MediaItem.PosterPath;
    }else{
      return detail.MediaItem.PosterPath;
    }
  }

  public getUrlByItemMovieDataBase(item:Item){
    if(item.MetadataAgentsId==MetadataAgents.TMDb)
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
