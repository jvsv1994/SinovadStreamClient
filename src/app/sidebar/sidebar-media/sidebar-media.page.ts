
import { Component, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Library } from 'src/app/libraries/shared/library.model';
import { LibraryService } from 'src/app/libraries/shared/library.service';
import { SignalIRHubService } from 'src/app/media/shared/services/signal-ir-hub.service';
import { Menu } from 'src/app/menus/shared/menu.model';
import { MediaServer } from 'src/app/servers/shared/server.model';
import { MediaType } from 'src/app/shared/enums';
import { SharedService } from 'src/app/shared/services/shared-data.service';

declare var window;
@Component({
  selector: 'app-sidebar-media',
  templateUrl: './sidebar-media.page.html',
  styleUrls: ['./sidebar-media.page.scss']
})
export class SidebarMediaPage{

  @Output() collapseSidebar=new EventEmitter();
  subscriptionCompleteConnection:Subscription;
  mediaMenu:Menu[]=[];

  constructor(
    private libraryService:LibraryService,
    private signalIrService:SignalIRHubService,
    public sharedService:SharedService) {
      this.subscriptionCompleteConnection=this.signalIrService.isCompletedConnection().subscribe((res)=>{
      this.sharedService.hubConnection.on('EnableMediaServer', (mediaServerGuid:string) => {
        var mediaServerMenu=this.mediaMenu.find(x=>x.MediaServerGuid==mediaServerGuid);
        if(!mediaServerMenu.IsSecureConnection)
        {
          mediaServerMenu.IsSecureConnection=true;
          var mediaServer=this.sharedService.mediaServers.find(x=>x.Guid==mediaServerMenu.MediaServerGuid);
          if(mediaServer)
          {
            this.updateLibrariesInMediaServer(mediaServerMenu,mediaServer);
          }
        }
      });
      this.sharedService.hubConnection.on('DisableMediaServer', (mediaServerGuid:string) => {
        var mediaServerMenu=this.mediaMenu.find(x=>x.MediaServerGuid==mediaServerGuid);
        if(mediaServerMenu.IsSecureConnection)
        {
          mediaServerMenu.IsSecureConnection=false;
          mediaServerMenu.ChildMenus=[];
        }
      });
      this.sharedService.hubConnection.on('UpdateLibrariesByMediaServer', (mediaServerGuid:string) => {
        var mediaServerMenu=this.mediaMenu.find(x=>x.MediaServerGuid==mediaServerGuid);
        var mediaServer=this.sharedService.mediaServers.find(x=>x.Guid==mediaServerGuid);
        if(mediaServerMenu && mediaServer)
        {
          mediaServerMenu.IsSecureConnection=true;
          this.updateLibrariesInMediaServer(mediaServerMenu,mediaServer);
        }
      });
    });
  }


  ngOnInit(){
    this.getMediaMenu();
  }

  ngOnDestroy(){
    this.subscriptionCompleteConnection.unsubscribe();
  }

  public getMediaMenu(){
    var listOptions:Menu[]=[];
    var home = new Menu();
    home.SortOrder = listOptions.length+1;
    home.Title = "Inicio";
    home.Path = "/home";
    home.IconClass = "fa-house fa-solid";
    listOptions.push(home);
    var movies = new Menu();
    movies.SortOrder = listOptions.length + 1;
    movies.Title = "Películas";
    movies.Path = "/media/movies";
    movies.IconClass = "fa-film fa-solid";
    listOptions.push(movies);
    var tvseries = new Menu();
    tvseries.SortOrder = listOptions.length + 1;
    tvseries.Title = "Series";
    tvseries.Path = "/media/tvseries";
    tvseries.IconClass = "fa-tv fa-solid";
    listOptions.push(tvseries);
    this.mediaMenu=listOptions;
    this.sharedService.mediaServers.forEach(mediaServer => {
        var ms = new Menu();
        ms.SortOrder = this.mediaMenu.length + 1;
        ms.Title = mediaServer.FamilyName!=null && mediaServer.FamilyName!="" ? mediaServer.FamilyName:mediaServer.DeviceName;
        ms.Path = "/media/server/"+mediaServer.Guid;
        ms.ChildMenus=[];
        ms.MediaServerId=mediaServer.Id;
        ms.MediaServerGuid=mediaServer.Guid;
        this.mediaMenu.push(ms);
    });
    this.buildMediaMenuFromListLibraries();
  }

  public buildMediaMenuFromListLibraries(){
    this.sharedService.mediaServers.forEach(mediaServer => {
      var mediaServerMenu=this.mediaMenu.find(x=>x.MediaServerId==mediaServer.Id);
      if(mediaServer.isSecureConnection)
      {
        mediaServerMenu.IsSecureConnection=true;
        this.updateLibrariesInMediaServer(mediaServerMenu,mediaServer);
      }else{
        mediaServerMenu.IsSecureConnection=false;
        mediaServerMenu.ChildMenus=[];
      }
    });
  }

  public updateLibrariesInMediaServer(mediaServerMenu:Menu,mediaServer:MediaServer){
    this.libraryService.getLibrariesByMediaServer(mediaServer.Url).then((libraries:Library[])=>{
      var childMenus=[];
      libraries.forEach(library => {
        var ml = new Menu();
        ml.SortOrder = childMenus.length + 1;
        ml.Title = library.Name;
        ml.Path = "/media/server/" + mediaServer.Guid+"/libraries/"+library.Id;
        ml.IconClass = library.MediaTypeCatalogDetailId == MediaType.Movie ? "fa-film fa-solid" : "fa-tv fa-solid";
        childMenus.push(ml);
      });
      mediaServerMenu.ChildMenus=childMenus;
    });
  }

  public onClickModule(module:Menu){
    module.isCollapsed=!module.isCollapsed;
  }

  public isSelectedMenu(option:Menu){
    if(decodeURIComponent(window.location.pathname).indexOf(option.Path)!=-1)
    {
      return true;
    }
    return false;
  }

  public onClickOutsideSidebar(event:any){
    this.collapseSidebar.emit(true);
  }

}
