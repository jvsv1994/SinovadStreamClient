
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from 'src/app/menus/shared/menu.model';
import { MenuService } from 'src/app/menus/shared/menu.service';
import { SinovadApiGenericResponse } from 'src/app/response/sinovadApiGenericResponse';
import { SharedService } from 'src/app/shared/services/shared-data.service';

declare var window;
@Component({
  selector: 'app-sidebar-media',
  templateUrl: './sidebar-media.page.html',
  styleUrls: ['./sidebar-media.page.scss']
})
export class SidebarMediaPage{

  @Output() collapseSidebar=new EventEmitter();

  constructor(
    public sharedService:SharedService,
    private menuService:MenuService,
    private router: Router) {

    }


  ngOnInit(){

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
