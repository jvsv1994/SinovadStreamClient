
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LibraryService } from 'src/app/libraries/shared/library.service';
import { Menu } from 'src/app/menus/shared/menu.model';
import { SinovadApiGenericResponse } from 'src/app/response/sinovadApiGenericResponse';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';

declare var window;
@Component({
  selector: 'app-sidebar-media',
  templateUrl: './sidebar-media.page.html',
  styleUrls: ['./sidebar-media.page.scss']
})
export class SidebarMediaPage{

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
      Path:"/media/movies",
      IconClass:"fa-film fa-solid"
    },{
      Id:3,
      SortOrder:3,
      Title:"Series",
      Path:"/media/tvseries",
      IconClass:"fa-solid fa-tv"
    }
  ]


  constructor(
    private sharedService:SharedDataService,
    private libraryService:LibraryService,
    private router: Router) {

    }


  ngOnInit(){
  /*   this.libraryService.GetAllLibrariesByUser(this.sharedService.userData.Id).then((response:SinovadApiGenericResponse)=>{
      var listLibraries=response.Data;


    },error=>{

    }); */
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
