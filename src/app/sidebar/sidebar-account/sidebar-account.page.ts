
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { ActivatedRoute } from '@angular/router';
import { SidebarOption } from '../shared/sidebar-option.model';
import { Menu } from 'src/app/menus/shared/menu.model';
import { DropDownMenuOptions } from '../shared/drop-down-menu-options.model';
import { DropDownMenuItem } from '../shared/drop-down-menu-Item.model';
import { MediaServer } from 'src/app/servers/shared/server.model';
import { DropDownServersService } from '../shared/drop-down-servers.service';
import { SignalIRHubService } from 'src/app/media/shared/services/signal-ir-hub.service';
import { Subscription } from 'rxjs';

declare var window;
@Component({
  selector: 'app-sidebar-account',
  templateUrl: './sidebar-account.page.html',
  styleUrls: ['./sidebar-account.page.scss']
})
export class SidebarAccountPage implements OnInit {

  mediaServers:MediaServer[]=[];
  subscriptionEnableMediaServer:Subscription;
  subscriptionDisableMediaServer:Subscription;
  selectedMediaServer:MediaServer;
  @Output() collapseSidebar=new EventEmitter();
  @ViewChild('mediaServerButton') mediaServerButton:ElementRef ;
  loadingConnection:boolean=true;
  serverModules:SidebarOption[]=[
  /*   {
      index:1,
      order:1,
      name:"Estado",
      listOptions:[
        {
          index:1,
          name:"Panel de Control",
          path:"/settings/server/{serverGuid}/status/server-dashboard"
        },
        {
          index:2,
          name:"Alertas",
          path:"/settings/server/{serverGuid}/status/alerts"
        }
      ]
    } , */{
      index:2,
      order:2,
      name:"Ajustes",
      listOptions:[
        {
          index:3,
          name:"General",
          path:"/settings/server/{serverGuid}/settings/general"
        },
        {
          index:4,
          name:"Transcodificador",
          path:"/settings/server/{serverGuid}/settings/transcoder"
        }
      ]
    },{
      index:3,
      order:3,
      name:"Gestionar",
      listOptions:[
        {
          index:7,
          name:"Bibliotecas",
          path:"/settings/server/{serverGuid}/manage/libraries"
        }
      ]
    }
  ]

  constructor(
    private signalIrService:SignalIRHubService,
    public dropDownServersService:DropDownServersService,
    public activeRoute: ActivatedRoute,
    public  ref:ChangeDetectorRef,
    public sharedService: SharedService) {
      this.subscriptionEnableMediaServer=this.signalIrService.isEnablingMediaServer().subscribe((mediaServerGuid:string) => {
        if(this.selectedMediaServer && this.selectedMediaServer.Guid==mediaServerGuid && !this.selectedMediaServer.isSecureConnection)
        {
          this.selectedMediaServer.isSecureConnection=true;
          this.loadingConnection=false;
        }
        var mediaServer=this.mediaServers.find(x=>x.Guid==mediaServerGuid);
        if(mediaServer && !mediaServer.isSecureConnection)
        {
          mediaServer.isSecureConnection=true;
        }
      });
      this.subscriptionDisableMediaServer=this.signalIrService.isDisablingMediaServer().subscribe((mediaServerGuid:string) => {
        if(this.selectedMediaServer && this.selectedMediaServer.Guid==mediaServerGuid && this.selectedMediaServer.isSecureConnection)
        {
          this.selectedMediaServer.isSecureConnection=false;
        }
        var mediaServer=this.mediaServers.find(x=>x.Guid==mediaServerGuid);
        if(mediaServer && mediaServer.isSecureConnection)
        {
          mediaServer.isSecureConnection=false;
        }
      });
    }

  ngOnInit(): void {
    this.mediaServers=JSON.parse(JSON.stringify(this.sharedService.mediaServers));
    this.setSelectedMediaServer();
  }

  ngOnDestroy(){
    this.subscriptionEnableMediaServer.unsubscribe();
    this.subscriptionDisableMediaServer.unsubscribe();
  }

  public setSelectedMediaServer(){
    if(this.activeRoute.firstChild.firstChild.snapshot.params.serverGuid)
    {
      var mediaServerGuid=this.activeRoute.firstChild.firstChild.snapshot.params.serverGuid;
      var selectedMediaServer=this.mediaServers.find(x=>x.Guid==mediaServerGuid);
      if(selectedMediaServer)
      {
        this.selectedMediaServer=selectedMediaServer;
      }
    }
    if(this.selectedMediaServer.isSecureConnection)
    {
      this.loadingConnection=false;
    }else{
      setTimeout(() => {
        this.loadingConnection=false;
      }, 3000);
    }
  }

  public getOptionPath(option:SidebarOption){
    var path=option.path;
    return path.replace("{serverGuid}",this.selectedMediaServer.Guid);
  }

  public onClickModule(module:Menu){
    module.isCollapsed=!module.isCollapsed;
  }


  public togleDropDownMediaServers(event:any){
    this.showMediaServerMenuOptions(event);
  }

  public showMediaServerMenuOptions(event:any){
    if(!this.dropDownServersService.isShowing)
    {
      this.dropDownServersService.show(this.getDropDownMenuOptions()).then((selectedItem:DropDownMenuItem<MediaServer>)=>{
        this.selectedMediaServer=selectedItem.itemData;
      },reject=>{

      });
    }
  }

  public getDropDownMenuOptions():DropDownMenuOptions<MediaServer>{
    var options:DropDownMenuOptions<MediaServer>=undefined;
    if(this.mediaServerButton)
    {
      let listItems:DropDownMenuItem<MediaServer>[]=[];
      this.mediaServers.forEach(element => {
        listItems.push({title:element.FamilyName?element.FamilyName:element.DeviceName,subtitle:element.isSecureConnection?"Conexión exitosa":'Sin conexión',
        iconClass:element.isSecureConnection?"fa-solid fa-lock icon-secure":"fa-solid fa-triangle-exclamation icon-alert",
        path:"/settings/server/"+element.Guid+"/settings/general",isSelected:this.selectedMediaServer.Id==element.Id?true:false,itemData:element});
      });
      var options:DropDownMenuOptions<MediaServer>={containerId:"sinovadMainContainer",target:this.mediaServerButton.nativeElement,listItems:listItems};
    }
    return options;
  }

  public isSelectedSidebarOption(option:SidebarOption){
    var path=this.getOptionPath(option);
    if(path.indexOf(window.location.pathname)!=-1)
    {
      return true;
    }
    return false;
  }

  public isSelectedAccountOption(){
    if('/settings/account'.indexOf(window.location.pathname)!=-1)
    {
      return true;
    }
    return false;
  }

  public isSelectedServerOption(){
    if(window.location.pathname.startsWith('/settings/server'))
    {
      return true;
    }
    return false;
  }

  public onClickOutsideSidebar(event:any){
    this.collapseSidebar.emit(true);
  }

}
