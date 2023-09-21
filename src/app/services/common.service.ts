import { Injectable } from '@angular/core';
import { SharedDataService } from './shared-data.service';
import { FormGroup } from '@angular/forms';
import { MetadataAgents } from '../modules/shared/enums/enums';
import { Item } from '../modules/pages/media/models/item.model';

@Injectable({ providedIn: 'root' })
export class CommonService {

  constructor(public sharedDataService:SharedDataService) {

  }


  public checkIfIsEnableMenuOptionByPath(path:string){
   /*  var findOption=false;
    for (let index = 0; index < this.sharedDataService.manageMenus.length; index++) {
      const menu = this.sharedDataService.manageMenus[index];
      if(menu.ChildMenus && menu.ChildMenus.findIndex(x=>x.Path && x.Path.includes(path))!=-1)
      {
        findOption=true;
        break;
      }
    }
    return findOption; */
    return true;
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
      return this.sharedDataService.originalUrlImagesMovieDataBase+item.PosterPath;
    }else{
      if(item.PosterPath)
      {
        return item.PosterPath;
      }else{
        var mediaServer=this.sharedDataService.mediaServers.find(x=>x.Id==item.MediaServerId);
        if(mediaServer)
        {
          return mediaServer.Url+"/media/"+item.MediaFileGuid+"/thumbnail.png";
        }else{
          return "assets/img/no-image-available.jpg";
        }
      }
    }
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
