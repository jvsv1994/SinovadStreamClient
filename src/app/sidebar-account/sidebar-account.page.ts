
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient } from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { Menu } from '../../models/menu';
import { Router } from '@angular/router';
import { SidebarModule } from 'src/models/sidebarModule';
import { SidebarOption } from 'src/models/sidebarOption';
import { DropDownMenuPage } from '../drop-down-menu/drop-down-menu.page';
import { DropDownMenuItem } from '../drop-down-menu/dropDownMenuItem';
import { MediaServer } from 'src/models/mediaServer';

declare var window;
@Component({
  selector: 'app-sidebar-account',
  templateUrl: './sidebar-account.page.html',
  styleUrls: ['./sidebar-account.page.scss']
})
export class SidebarAccountPage extends ParentComponent implements OnInit {

  @Output() prepareRouterOutlet=new EventEmitter<boolean>();
  @Output() hideSidebar=new EventEmitter<boolean>();
  @ViewChild('dropDownMenuPage') dropDownMenuPage: DropDownMenuPage;
  selectedSidebarOption:SidebarOption;
  selectedSidebarModule:SidebarModule;
  serverModules:SidebarModule[]=[
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
    private router: Router,
    public  ref:ChangeDetectorRef,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

  ngOnInit(): void {
    this.replaceMediaServerGuidInPaths();
  }

  ngAfterViewInit(){

  }

  private async replaceMediaServerGuidInPaths(){
    if(this.sharedData.selectedMediaServer!=undefined)
    {
      this.serverModules.forEach(module => {
        module.listOptions.forEach(option => {
          if(option.path.indexOf(window.location.pathname)!=-1)
          {
            this.selectedSidebarOption=option;
            this.selectedSidebarModule=module;
          }
        });
      });
    }else{
        await this.delay(100);
        this.replaceMediaServerGuidInPaths();
    }
  }

  public getOptionPath(option:SidebarOption){
    return option.path.replace("{serverGuid}",this.sharedData.selectedMediaServer.Guid);
  }

  public onClickModule(module:Menu){
    module.isCollapsed=!module.isCollapsed;
  }

  public onClickSidebarOption(option:SidebarOption,module:SidebarModule){
    this.prepareRouterOutlet.emit(true);
    let ctx=this;
    this.router.navigateByUrl(option.path).then((response) => {
      ctx.selectedSidebarModule=module;
      ctx.selectedSidebarOption=option;
      if(ctx.isSmallDevice())
      {
        ctx.hideSidebar.emit(true);
      }
    },error=>{
      console.error(error);
    });
  }


  public togleDropDownMediaServers(event:any){

      this.showMediaServerMenuOptions(event);

  }

  public showMediaServerMenuOptions(event:any){
    var target=event.currentTarget;
    const rect = target.getBoundingClientRect();
    console.log(rect);
    let listItems:DropDownMenuItem[]=[];
    this.sharedData.mediaServers.forEach(element => {
      listItems.push({title:element.FamilyName?element.FamilyName:element.DeviceName,subtitle:"Funcionando",iconClass:"fa-solid fa-thumbs-up",
      path:"/settings/server/"+element.Guid+"/settings/general",isSelected:this.sharedData.selectedMediaServer.Id==element.Id?true:false});
    });
    this.dropDownMenuPage.show({containerId:"sinovadMainContainer",left:rect.left,width:rect.width,top:rect.top+rect.height,listItems:listItems});
  }

}
