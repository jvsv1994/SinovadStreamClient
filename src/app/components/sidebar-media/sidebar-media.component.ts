
import { Component, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Menu } from 'src/app/modules/pages/manage/modules/pages/menus/models/menu.model';
import { MediaServer } from 'src/app/modules/pages/manage/modules/pages/servers/models/server.model';
import { Library } from 'src/app/modules/pages/settings/modules/pages/server/modules/pages/manage/modules/pages/libraries/models/library.model';
import { LibraryService } from 'src/app/modules/pages/settings/modules/pages/server/modules/pages/manage/modules/pages/libraries/services/library.service';
import { MediaType } from 'src/app/modules/shared/enums/enums';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { SignalIRHubService } from 'src/app/services/signal-ir-hub.service';

declare var window;
@Component({
  selector: 'app-sidebar-media',
  templateUrl: './sidebar-media.component.html',
  styleUrls: ['./sidebar-media.component.scss']
})
export class SidebarMediaComponent{

  @Output() collapseSidebar=new EventEmitter();
  subscription:Subscription= new Subscription();
  mediaMenu:Menu[]=[];

  constructor(
    private libraryService:LibraryService,
    private signalIrService:SignalIRHubService,
    public sharedDataService:SharedDataService) {
      this.subscription.add(this.signalIrService.isEnablingMediaServer().subscribe((mediaServerGuid:string) => {
        var mediaServerMenu=this.mediaMenu.find(x=>x.MediaServerGuid==mediaServerGuid);
        if(mediaServerMenu && !mediaServerMenu.IsSecureConnection)
        {
          mediaServerMenu.IsSecureConnection=true;
          var mediaServer=this.sharedDataService.mediaServers.find(x=>x.Guid==mediaServerMenu.MediaServerGuid);
          if(mediaServer)
          {
            this.updateLibrariesInMediaServer(mediaServerMenu,mediaServer);
          }
        }
      }));
      this.subscription.add(this.signalIrService.isDisablingMediaServer().subscribe((mediaServerGuid:string) => {
        var mediaServerMenu=this.mediaMenu.find(x=>x.MediaServerGuid==mediaServerGuid);
        if(mediaServerMenu && mediaServerMenu.IsSecureConnection)
        {
          mediaServerMenu.IsSecureConnection=false;
          mediaServerMenu.ChildMenus=[];
        }
      }));
      this.subscription.add(this.signalIrService.isUpdatingLibrariesByMediaServer().subscribe((mediaServerGuid:string) => {
        var mediaServerMenu=this.mediaMenu.find(x=>x.MediaServerGuid==mediaServerGuid);
        var mediaServer=this.sharedDataService.mediaServers.find(x=>x.Guid==mediaServerGuid);
        if(mediaServerMenu && mediaServer)
        {
          mediaServerMenu.IsSecureConnection=true;
          this.updateLibrariesInMediaServer(mediaServerMenu,mediaServer);
        }
      }));
  }


  ngOnInit(){
    this.getMediaMenu();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  public getMediaMenu(){
    var listOptions:Menu[]=[];
    var home = new Menu();
    home.SortOrder = listOptions.length+1;
    home.Title = "Inicio";
    home.Path = "/home";
    home.IconClass = "fa-house fa-solid";
    listOptions.push(home);
    this.mediaMenu=listOptions;
    this.sharedDataService.mediaServers.forEach(mediaServer => {
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
    this.sharedDataService.mediaServers.forEach(mediaServer => {
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
