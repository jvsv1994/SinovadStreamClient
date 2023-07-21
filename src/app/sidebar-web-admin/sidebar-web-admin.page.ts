
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
  selector: 'app-sidebar-web-admin',
  templateUrl: './sidebar-web-admin.page.html',
  styleUrls: ['./sidebar-web-admin.page.scss']
})
export class SideBarWebAdminPage extends ParentComponent implements OnInit {

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
    this.refreshSidebarOption.subscribe(event => {
      ctx.onClickSidebarOption(ctx.selectedSidebarOption,ctx.selectedSidebarModule);
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

  public onClickModule(module:Menu){
    module.isCollapsed=!module.isCollapsed;
  }

  public onClickSidebarOption(option:Menu,module:Menu){
    this.prepareRouterOutlet.emit(true);
    let ctx=this;
    this.router.navigateByUrl(option.Path).then((response) => {
      ctx.selectedSidebarOption=option;
      ctx.selectedSidebarModule=module;
      if(ctx.isSmallDevice())
      {
        ctx.collapseSidebar.emit(true);
      }
    },error=>{
      console.error(error);
    });
  }

  public onClickOutsideSidebar(){
    setTimeout(() => {
      this.collapseSidebar.emit(true);
    }, 250);
  }

}
