
import { ChangeDetectorRef, Component, HostListener} from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LibraryListComponent } from './modules/pages/settings/modules/pages/server/modules/pages/manage/modules/pages/libraries/components/library-list/library-list.component';
import { AlertsComponent } from './modules/pages/settings/modules/pages/server/modules/pages/status/modules/pages/alerts/components/alerts/alerts.component';
import { UserService } from './modules/pages/manage/modules/pages/users/services/user.service';
import { DashboardComponent } from './modules/pages/settings/modules/pages/server/modules/pages/status/modules/pages/dashboard/components/dashboard/dashboard.component';
import { DeviceData } from './models/device-data.model';
import { SharedDataService } from './services/shared-data.service';
import { CommonService } from './services/common.service';
import { LoginComponent } from './modules/pages/login/components/login/login.component';
import { RegisterUserComponent } from './modules/pages/register-user/components/register-user/register-user.component';
import { ResetPasswordComponent } from './modules/pages/reset-password/components/reset-password/reset-password.component';
import { ConfirmEmailComponent } from './modules/pages/confirm-email/components/confirm-email/confirm-email.component';
import { NotFoundPageComponent } from './components/pages/not-found-page/not-found-page.component';
import { LandingPageComponent } from './components/pages/landing-page/landing-page.component';
import { RecoverPasswordComponent } from './modules/pages/recover-password/components/recover-password/recover-password.component';
import { ServerSettingsGeneralPageComponent } from './modules/pages/settings/modules/pages/server/modules/pages/settings/modules/pages/general/components/server-settings-general/server-settings-general.page.component';
import { TranscoderSettingssPageComponent } from './modules/pages/settings/modules/pages/server/modules/pages/settings/modules/pages/transcode/components/transcode-settings/transcode-settings-page.component';
import { MyAccountPageComponent } from './modules/pages/settings/modules/pages/account-settings/components/my-account/my-account-page.component';
import { MovieListComponent } from './modules/pages/manage/modules/pages/movies/components/movie-list/movie-list.component';
import { TvSerieListComponent } from './modules/pages/manage/modules/pages/tvseries/components/tvserie-list/tvserie-list.component';
import { UserListComponent } from './modules/pages/manage/modules/pages/users/components/user-list/user-list.component';
import { GenreListComponent } from './modules/pages/manage/modules/pages/genres/components/genre-list/genre-list.component';
import { MenuListComponent } from './modules/pages/manage/modules/pages/menus/components/menu-list/menu-list.component';
import { RoleListComponent } from './modules/pages/manage/modules/pages/roles/components/role-list/role-list.component';
import { SearchViewComponent } from './modules/pages/media-search/components/search-view/search-view.component';
import { ProfilesViewComponent } from './modules/pages/profiles/components/profiles-view/profiles-view.component';
import { HomePageComponent } from './modules/pages/home/components/home-page/home-page.component';
import { ItemVideoComponent } from './modules/pages/media/components/item-video/item-video.component';
import { ServerItemsComponent } from './modules/pages/media/components/server-items/server-items.component';
import { LibraryItemsComponent } from './modules/pages/media/components/library-items/library-items.component';
import { ItemDetailComponent } from './modules/pages/media/components/item-detail/item-detail.component';
import { LogPageComponent } from './modules/pages/settings/modules/pages/web/components/log-page/log-page.component';
import { CatalogListComponent } from './modules/pages/manage/modules/pages/catalogs/components/catalog-list/catalog-list.component';
import { CatalogFormComponent } from './modules/pages/manage/modules/pages/catalogs/components/catalog-form/catalog-form.component';
import { CatalogDetailListComponent } from './modules/pages/manage/modules/pages/catalogs/components/catalog-detail-list/catalog-detail-list.component';
import { CatalogDetailFormComponent } from './modules/pages/manage/modules/pages/catalogs/components/catalog-detail-form/catalog-detail-form.component';
import { UserRolesComponent } from './modules/pages/manage/modules/pages/users/components/user-roles/user-roles.component';
import { RoleMenusComponent } from './modules/pages/manage/modules/pages/roles/components/role-menus/role-menus.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{

  _window=window;
  isCollapsedSidebar:boolean=false;
  showingSidebarAccount:boolean=false;
  showingSidebarAdminMode:boolean=false;
  showingSidebarMedia:boolean=false;
  showRouterChildWithFullDimentions:boolean=true;

  constructor(
    public commonService:CommonService,
    private deviceService: DeviceDetectorService,
    private userService:UserService,
    public ref: ChangeDetectorRef,
    public sharedDataService: SharedDataService) {}

    public ngOnInit(): void {
      var deviceInfo=this.deviceService.getDeviceInfo();
      this.sharedDataService.deviceData = new DeviceData();
      this.sharedDataService.deviceData.OperatingSystem=deviceInfo.os;
      this.sharedDataService.deviceData.DeviceType=deviceInfo.deviceType;
      this.sharedDataService.deviceData.Browser=deviceInfo.browser;
      const queryString = window.location.search;
      if (queryString != "") {
          const urlParams = new URLSearchParams(queryString);
          var apiToken = urlParams.get('apiToken');
          if(apiToken!=null)
          {
            localStorage.setItem('apiToken',apiToken);
          }
      }
      if((<any>window).configurationData)
      {
        this.sharedDataService.configurationData=(<any>window).configurationData;
      }
      if(localStorage.getItem('apiToken'))
      {
        this.sharedDataService.apiToken=localStorage.getItem('apiToken');
      }
    }

    ngAfterViewInit(){
      let ctx=this;
      let customClickEvent=function onCustomClick(event:any) {
        if(ctx.sharedDataService.configurationData.alwaysFullScreen)
        {
          ctx.showPageInFullScreen();
        }
      }
      window.addEventListener('click',customClickEvent);
    }

    public showPageInFullScreen(){
      if(!document.fullscreenElement)
      {
        if (document.body.requestFullscreen) {
          document.body.requestFullscreen();
        }
      }
    }


    public onClickToggleSidebarButton(){
      this.isCollapsedSidebar=!this.isCollapsedSidebar;
    }

    public onActivate(event:any){
      this.isCollapsedSidebar=true;
      this.sharedDataService.showSplashScreen=false;
      if(event instanceof NotFoundPageComponent || event instanceof ItemVideoComponent || event instanceof LoginComponent || event instanceof RegisterUserComponent
        || event instanceof RecoverPasswordComponent || event instanceof ResetPasswordComponent
        || event instanceof LandingPageComponent || event instanceof ConfirmEmailComponent || event instanceof ProfilesViewComponent)
      {
        this.showRouterChildWithFullDimentions=true;
        this.showingSidebarMedia=false;
        this.showingSidebarAccount=false;
        this.showingSidebarAdminMode=false;
      }
      if(event instanceof HomePageComponent || event instanceof ServerItemsComponent || event instanceof LibraryItemsComponent || event instanceof ItemDetailComponent || event instanceof SearchViewComponent)
      {
        this.showRouterChildWithFullDimentions=false;
        this.showingSidebarMedia=true;
        this.showingSidebarAccount=false;
        this.showingSidebarAdminMode=false;
      }
      if(event instanceof MyAccountPageComponent || event instanceof TranscoderSettingssPageComponent || event instanceof ServerSettingsGeneralPageComponent ||
        event instanceof LibraryListComponent || event instanceof AlertsComponent || event instanceof DashboardComponent || event instanceof LogPageComponent)
      {
        this.showRouterChildWithFullDimentions=false;
        this.showingSidebarAccount=true;
        this.showingSidebarAdminMode=false;
        this.showingSidebarMedia=false;
      }
      if(event instanceof MovieListComponent || event instanceof TvSerieListComponent || event instanceof MenuListComponent
        || event instanceof GenreListComponent || event instanceof UserListComponent || event instanceof RoleListComponent
        || event instanceof CatalogListComponent || event instanceof CatalogFormComponent || event instanceof CatalogDetailListComponent
        || event instanceof CatalogDetailFormComponent || event instanceof UserRolesComponent || event instanceof RoleMenusComponent)
      {
        this.showRouterChildWithFullDimentions=false;
        this.showingSidebarAccount=false;
        this.showingSidebarAdminMode=true;
        this.showingSidebarMedia=false;
      }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {

    }
}
