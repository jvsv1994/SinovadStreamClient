import { Injectable } from '@angular/core';
import { HubConnection } from '@microsoft/signalr';
import { DeviceData } from 'src/app/models/device-data.model';
import { User } from '../modules/pages/manage/modules/pages/users/models/user.model';
import { Configuration } from '../modules/shared/models/configuration.model';
import { Menu } from '../modules/pages/manage/modules/pages/menus/models/menu.model';
import { MediaServer } from '../modules/pages/manage/modules/pages/servers/models/server.model';
import { LinkedAccount } from '../modules/pages/login/models/linked-account.model';
import { Profile } from '../modules/pages/profiles/models/profile.model';
import { Log } from '../modules/pages/settings/modules/pages/web/models/log.model';
import { Role } from '../modules/pages/manage/modules/pages/roles/models/role.model';

@Injectable({ providedIn: 'root' })
export class SharedDataService {

  showSplashScreen:boolean=true;
  userData: User;
  urlSinovadStreamWebApi: string='http://localhost:53363';
  //urlSinovadStreamWebApi: string='https://streamapi.sinovad.com';
  urlSinovadCdn: string='https://resources.sinovad.com/stream/web';
  originalUrlImagesMovieDataBase:String="https://image.tmdb.org/t/p/w600_and_h900_bestv2";
  urlEpisodeDataBase:string="https://www.themoviedb.org/t/p/w454_and_h254_bestv2";
  apiToken:string;
  currentProfile:Profile;
  configurationData:Configuration=new Configuration();
  listProfiles:Profile[]=[];
  manageMenus:Menu[]=[];
  mediaServers:MediaServer[]=[];
  roles:Role[]=[];
  linkedAccounts:LinkedAccount[]=[];
  hubConnection:HubConnection;
  deviceData:DeviceData;
  hubLog:string[]=[];
  webLogs:Log[]=[];

  constructor() {

  }

}
