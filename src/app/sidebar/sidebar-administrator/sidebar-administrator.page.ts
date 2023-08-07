
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { HttpClient } from '@angular/common/http';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { ParentComponent } from 'src/app/parent/parent.component';
import { Menu } from 'src/app/menus/shared/menu.model';

declare var window;
@Component({
  selector: 'app-sidebar-administrator',
  templateUrl: './sidebar-administrator.page.html',
  styleUrls: ['./sidebar-administrator.page.scss']
})
export class SidebarAdministratorPage extends ParentComponent implements OnInit {

  @Input() selectHomeUserOption:EventEmitter<boolean>;
  @Input() unselectSidebarOption:EventEmitter<boolean>;
  @Input() refreshSidebarOption=new EventEmitter<boolean>();
  @Output() prepareRouterOutlet=new EventEmitter<boolean>();
  @Output() collapseSidebar=new EventEmitter();

  selectedSidebarOption:Menu;
  selectedSidebarModule:Menu;

  constructor(
    public  ref:ChangeDetectorRef,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)

    }

  ngOnInit(): void {
    let ctx=this;
    this.selectHomeUserOption.subscribe(event => {
      ctx.selectDefaultOption();
    });
    this.unselectSidebarOption.subscribe(event => {
      ctx.selectedSidebarOption=undefined;
      ctx.selectedSidebarModule=undefined;
    });
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.setSelectedOptionByPathname();
    }, 500);
  }

  public selectDefaultOption(){
    this.selectedSidebarModule=this.sharedData.listMenus[0];
    this.selectedSidebarOption=this.selectedSidebarModule.ChildMenus[0];
  }

  public setSelectedOptionByPathname(){
    this.sharedData.listMenus.forEach(menu => {
      menu.ChildMenus.forEach(child => {
        if(window.location.pathname.indexOf(child.Path)!=-1)
        {
          this.selectedSidebarModule=menu;
          this.selectedSidebarOption=child;
        }
      });
    });
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
