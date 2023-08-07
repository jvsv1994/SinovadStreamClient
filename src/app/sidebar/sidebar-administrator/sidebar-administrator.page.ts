
import { Component, EventEmitter, Output } from '@angular/core';
import { Menu } from 'src/app/menus/shared/menu.model';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';

declare var window;
@Component({
  selector: 'app-sidebar-administrator',
  templateUrl: './sidebar-administrator.page.html',
  styleUrls: ['./sidebar-administrator.page.scss']
})
export class SidebarAdministratorPage{

  @Output() collapseSidebar=new EventEmitter();

  constructor(public sharedDataService:SharedDataService) {

    }

    public onClickModule(module:Menu,event:any){
      event.preventDefault();
      event.stopPropagation();
      module.isCollapsed=!module.isCollapsed;
    }

    public onClickOutsideSidebar(event:any){
      this.collapseSidebar.emit(true);
    }

    public isSelectedMenu(option:Menu){
      if(option.Path.indexOf(window.location.pathname)!=-1)
      {
        return true;
      }
      return false;
    }

}
