
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient } from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { Menu } from '../../models/menu';
import { Router } from '@angular/router';

declare var window;
@Component({
  selector: 'app-sidebar-media',
  templateUrl: './sidebar-media.page.html',
  styleUrls: ['./sidebar-media.page.scss']
})
export class SidebarMediaPage extends ParentComponent implements OnInit {

  selectedSidebarOption:Menu;
  selectedSidebarModule:Menu;
  mediaOptions:Menu[]=[
    {
      Id:1,
      SortOrder:1,
      Title:"Inicio",
      Path:"/home",
      IconClass:"fa-house fa-solid"
    },{
      Id:2,
      SortOrder:2,
      Title:"Peliculas",
      Path:"/movies",
      IconClass:"fa-film fa-solid"
    },{
      Id:3,
      SortOrder:3,
      Title:"Series",
      Path:"/tvseries",
      IconClass:"fa-solid fa-tv"
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

  }

  ngAfterViewInit(){

  }

  public selectDefaultOption(){

  }


  public onClickModule(module:Menu){
    module.isCollapsed=!module.isCollapsed;
  }

  public onClickSidebarOption(option:Menu,module:Menu){
    this.router.navigateByUrl(option.Path).then((response) => {

    },error=>{
      console.error(error);
    });
  }

}
