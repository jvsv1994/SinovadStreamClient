import { Injectable } from '@angular/core';
import { Configuration } from 'src/models/configuration';
import { User } from 'src/app/users/shared/user.model';
import { MediaServer } from 'src/app/media-servers/shared/media-server.model';
import { Menu } from 'src/app/menus/shared/menu.model';
import { Profile } from 'src/app/profiles/shared/profile.model';

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

}
