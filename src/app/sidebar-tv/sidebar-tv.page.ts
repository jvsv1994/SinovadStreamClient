
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient } from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { SidebarModule } from '../../models/sidebarModule';
import { Profile } from '../../models/profile';
import { SidebarOption } from '../../models/sidebarOption';

declare var window;
@Component({
  selector: 'app-sidebar-tv',
  templateUrl: './sidebar-tv.page.html',
  styleUrls: ['./sidebar-tv.page.scss']
})
export class SideBarTvPage extends ParentComponent implements OnInit {

  @Output() selectOption=new EventEmitter();
  listModules:any[]=[];
  showProfilesView:boolean=false;
  allModules:SidebarModule[]=[
    {
      index:1,
      order:1,
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
        },
        {
          index:4,
          name:"Búsqueda",
          method:"ShowSearch",
          iconClass:"fa-solid fa-magnifying-glass"
        },
        {
          index:5,
          name:"Cerrar Sesión",
          method:"logOut",
          iconClass:"fa-solid fa-right-from-bracket"
        }
      ]
    }
  ]
  selectedMenuOption:SidebarOption;

  constructor(
    public  ref:ChangeDetectorRef,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)

    }

  ngOnInit(): void {
    this.listModules=this.allModules;
    this.showProfilesView=true;
  }

  public onClickAvatarButton(){
    this.sharedData.showSplashScreen=true;
    this.showProfilesView=true;
  }

  public onClickMenuOption(option:SidebarOption){
    this.selectedMenuOption=option;
    this.selectOption.emit(this.selectedMenuOption);
  }

  public onSelectProfile(profile:Profile){
    this.sharedData.currentProfile=profile;
    this.selectedMenuOption=this.listModules[0].listOptions[0];
    this.selectOption.emit(this.selectedMenuOption);
    this.showProfilesView=false;
  }


}
