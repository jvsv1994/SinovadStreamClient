
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient } from '@angular/common/http';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { Router } from '@angular/router';
import { Menu } from '../menus/shared/menu.model';

declare var window;
@Component({
  selector: 'app-sidebar-media',
  templateUrl: './sidebar-media.page.html',
  styleUrls: ['./sidebar-media.page.scss']
})
export class SidebarMediaPage extends ParentComponent implements OnInit {

  @Output() collapseSidebar=new EventEmitter();
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
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)

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

  public isSelectedMenu(option:Menu){
    if(option.Path.indexOf(window.location.pathname)!=-1)
    {
      return true;
    }
    return false;
  }

  public onClickOutsideSidebar(event:any){
    this.collapseSidebar.emit(true);
  }

}
