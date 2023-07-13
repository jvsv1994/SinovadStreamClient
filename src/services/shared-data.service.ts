import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user';
import { BuilderVideo } from 'src/app/models/builderVideo';
import { Configuration } from 'src/app/models/configuration';
import { Profile } from 'src/app/models/profile';

@Injectable({ providedIn: 'root' })
export class SharedDataService {

  allOptions: any[];
  menuOptions: any[];
  userData: User;
  AdministratorRoleID: number=1;
  VisitatorRoleID: number=2;
  UserRoleID: number=3;
  currentVideo:BuilderVideo;
  currentMediaServerData:any;
  //urlSinovadBackEnd: string='http://localhost:53363';
  urlSinovadBackEnd: string='http://www.sinovad.com';
  storageMoviesBaseUrl: string='http://192.168.18.217:80/movies';
  storageAnimesBaseUrl: string='http://192.168.18.217:80/animes';
  storageSeriesBaseUrl: string='http://192.168.18.217:80/series';
  originalUrlImagesMovieDataBase:String="https://image.tmdb.org/t/p/w600_and_h900_bestv2";
  urlEpisodeDataBase:string="https://www.themoviedb.org/t/p/w454_and_h254_bestv2";
  currentSelectedElement:any;
  currentActiveSection:any;
  contextMenuData:any;
  listProcessGUIDs:String[]=[];
  currentToken:string;
  currentProfile:any;
  configurationData:Configuration=new Configuration();
  platform:string;
  listProfiles:Profile[]=[];

  constructor() {

  }




}
