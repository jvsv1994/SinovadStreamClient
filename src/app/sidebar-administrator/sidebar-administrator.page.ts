
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
    event.preventDefault();
    event.stopPropagation();
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