import { Injectable } from '@angular/core';
import { User } from 'src/models/user';
import { Configuration } from 'src/models/configuration';
import { Profile } from 'src/models/profile';
import { Menu } from 'src/models/menu';
import { MediaServer } from 'src/models/mediaServer';

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




}
