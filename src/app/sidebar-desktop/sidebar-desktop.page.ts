
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient } from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { SidebarModule } from '../models/sidebarModule';
import { SidebarOption } from '../models/sidebarOption';

declare var window;
@Component({
  selector: 'app-sidebar-desktop',
  templateUrl: './sidebar-desktop.page.html',
  styleUrls: ['./sidebar-desktop.page.scss']
})
export class SideBarDesktopPage extends ParentComponent implements OnInit {

  @Input() selectHomeUserOption:EventEmitter<boolean>;
  @Input() unselectSidebarOption:EventEmitter<boolean>;
  @Input() isCollapsedSidebar:boolean;
  @Output() selectOption=new EventEmitter();
  listModules:any[]=[];
  allModules:SidebarModule[]=[
    {
      index:1,
      order:1,
      name:"Media",
      listOptions:[
        {
          index:1,
          name:"Inicio",
          method:"ShowInitial",
          iconClass:"fa-solid fa-house"
        },
        {
          index:2,
          name:"Películas",
          method:"ShowMovies",
          iconClass:"fa-solid fa-film"
        },
        {
          index:3,
          name:"Series",
          method:"ShowSeries",
          iconClass:"fa-solid fa-tv"
        }
      ]
    },{
      index:2,
      name:"Almacenamiento",
      listOptions:[
        {
          index:5,
          name:"Almacenamiento",
          method:"ShowStorage",
          iconClass:"fa-solid fa-database"
        },
        {
          index:6,
          name:"Transcodificación",
          method:"ShowTranscoderSettingss",
          iconClass:"fa-solid fa-database"
        }
      ]
    },{
      index:3,
      order:3,
      name:"Mantenimiento",
      listOptions:[
        {
          index:7,
          name:"Peliculas",
          method:"ShowManagementMovies",
          iconClass:"fa-solid fa-list-check"
        },
        {
          index:8,
          name:"Series",
          method:"ShowManagementTvSeries",
          iconClass:"fa-solid fa-list-check"
        }
      ]
    }
  ]
  selectedSidebarOption:SidebarOption;
  selectedSidebarModule:SidebarModule;

  constructor(
    public  ref:ChangeDetectorRef,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

  ngOnInit(): void {
    this.listModules=this.allModules;
    this.selectDefaultOption();
    let ctx=this;
    this.selectHomeUserOption.subscribe(event => {
      ctx.selectDefaultOption();
    });
    this.unselectSidebarOption.subscribe(event => {
      ctx.selectedSidebarOption=undefined;
      ctx.selectedSidebarModule=undefined;
    });
  }

  public selectDefaultOption(){
    this.selectedSidebarModule=this.listModules[0];
    this.selectedSidebarOption=this.listModules[0].listOptions[0];
  }

  public onClickModule(module:SidebarModule){
    module.isCollapsed=!module.isCollapsed;
  }

  public onClickSidebarOption(option:SidebarOption,module:SidebarModule){
    this.selectedSidebarOption=option;
    this.selectedSidebarModule=module;
    this.selectOption.emit(this.selectedSidebarOption);
  }

}
