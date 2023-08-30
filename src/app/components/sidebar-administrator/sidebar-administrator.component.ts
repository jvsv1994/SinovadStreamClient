
import { Component, EventEmitter, Output } from '@angular/core';
import { Menu } from 'src/app/modules/pages/menus/shared/menu.model';
import { SharedService } from 'src/app/modules/shared/services/shared-data.service';

declare var window;
@Component({
  selector: 'app-sidebar-administrator',
  templateUrl: './sidebar-administrator.component.html',
  styleUrls: ['./sidebar-administrator.component.scss']
})
export class SidebarAdministratorComponent{

  @Output() collapseSidebar=new EventEmitter();

  constructor(public sharedService:SharedService) {

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
