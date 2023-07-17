import { Injectable } from '@angular/core';
import { User } from 'src/models/user';
import { BuilderVideo } from 'src/models/builderVideo';
import { Configuration } from 'src/models/configuration';
import { Profile } from 'src/models/profile';
import { Menu } from 'src/models/menu';

@Injectable({ providedIn: 'root' })
export class SharedDataService {

  userData: User;
  AdministratorRoleID: number=1;
  VisitatorRoleID: number=2;
  UserRoleID: number=3;
  currentVideo:BuilderVideo;
  currentMediaServerData:any;
  //urlSinovadStreamWebApi: string='http://localhost:53363';
  urlSinovadStreamWebApi: string='http://streamapi.sinovad.com';
  urlSinovadCdn: string='http://cdn.sinovad.com/stream/web';
  storageMoviesBaseUrl: string='http://192.168.18.217:80/movies';
  storageAnimesBaseUrl: string='http://192.168.18.217:80/animes';
  storageSeriesBaseUrl: string='http://192.168.18.217:80/series';
  originalUrlImagesMovieDataBase:String="https://image.tmdb.org/t/p/w600_and_h900_bestv2";
  urlEpisodeDataBase:string="https://www.themoviedb.org/t/p/w454_and_h254_bestv2";
  currentSelectedElement:any;
  currentActiveSection:any;
  listProcessGUIDs:String[]=[];
  currentToken:string;
  currentProfile:any;
  configurationData:Configuration=new Configuration();
  platform:string;
  listProfiles:Profile[]=[];
  listMenus:Menu[]=[];
  pageNotFoundShowing:boolean=false;

  constructor() {

  }




}
