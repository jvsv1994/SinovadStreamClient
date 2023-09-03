
import { ChangeDetectorRef, Component, HostListener} from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SearchViewPage } from './modules/pages/media-search/components/search-view/search-view.page';
import { VideoComponent } from './modules/pages/media-video/components/video/video.component';
import { MediaItemsComponent } from './modules/pages/media-items/components/media-items/media-items.component';
import { MediaDetailComponent } from './modules/pages/media-detail/components/media-detail/media-detail.component';
import { MyAccountPage } from './modules/pages/settings/modules/pages/account-settings/components/my-account/my-account.page';
import { TranscoderSettingssPage } from './modules/pages/settings/modules/pages/server/modules/pages/settings/modules/pages/transcode/components/transcode-settings/transcode-settings.page';
import { ServerSettingsGeneralPage } from './modules/pages/settings/modules/pages/server/modules/pages/settings/modules/pages/general/components/server-settings-general/server-settings-general.page';
import { LibraryListComponent } from './modules/pages/settings/modules/pages/server/modules/pages/manage/modules/pages/libraries/components/library-list/library-list.component';
import { AlertsComponent } from './modules/pages/settings/modules/pages/server/modules/pages/status/modules/pages/alerts/components/alerts/alerts.component';
import { UserService } from './modules/pages/manage/modules/pages/users/services/user.service';
import { MovieListPage } from './modules/pages/manage/modules/pages/movies/components/movie-list/movie-list.page';
import { GenreListPage } from './modules/pages/manage/modules/pages/genres/components/genre-list/genre-list.page';
import { TvSerieListPage } from './modules/pages/manage/modules/pages/tvseries/components/tvserie-list/tvserie-list.page';
import { UserListPage } from './modules/pages/manage/modules/pages/users/components/user-list/user-list.page';
import { MenuListPage } from './modules/pages/manage/modules/pages/menus/components/menu-list/menu-list.page';
import { RoleListPage } from './modules/pages/manage/modules/pages/roles/components/role-list/role-list.page';
import { DashboardComponent } from './modules/pages/settings/modules/pages/server/modules/pages/status/modules/pages/dashboard/components/dashboard/dashboard.component';
import { DeviceData } from './models/device-data.model';
import { SharedDataService } from './services/shared-data.service';
import { CommonService } from './services/common.service';
import { LoginComponent } from './modules/pages/login/components/login/login.component';
import { LandingComponent } from './modules/pages/landing/components/landing/landing.component';
import { RegisterUserComponent } from './modules/pages/register-user/components/register-user/register-user.component';
import { RecoverPasswordComponent } from './modules/pages/recover-password/components/recover-password.component';
import { ResetPasswordComponent } from './modules/pages/reset-password/components/reset-password/reset-password.component';
import { ConfirmEmailComponent } from './modules/pages/confirm-email/components/confirm-email/confirm-email.component';
import { ProfilesViewPage } from './modules/pages/profiles/components/profiles-view/profiles-view.page';
import { NotFoundPageComponent } from './components/pages/not-found-page/not-found-page.component';

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
        this.userService.getUserData();
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
      if(event instanceof NotFoundPageComponent || event instanceof VideoComponent || event instanceof LoginComponent || event instanceof RegisterUserComponent
        || event instanceof RecoverPasswordComponent || event instanceof ResetPasswordComponent
        || event instanceof LandingComponent || event instanceof ConfirmEmailComponent || event instanceof ProfilesViewPage)
      {
        this.showRouterChildWithFullDimentions=true;
        this.showingSidebarMedia=false;
        this.showingSidebarAccount=false;
        this.showingSidebarAdminMode=false;
      }
      if(event instanceof SearchViewPage)
      {
        this.showRouterChildWithFullDimentions=false;
        this.showingSidebarMedia=true;
        this.showingSidebarAccount=false;
        this.showingSidebarAdminMode=false;
      }
      if(event instanceof MediaItemsComponent || event instanceof MediaDetailComponent)
      {
        this.showRouterChildWithFullDimentions=false;
        this.showingSidebarMedia=true;
        this.showingSidebarAccount=false;
        this.showingSidebarAdminMode=false;
      }
      if(event instanceof MyAccountPage || event instanceof TranscoderSettingssPage || event instanceof ServerSettingsGeneralPage ||
        event instanceof LibraryListComponent || event instanceof AlertsComponent || event instanceof DashboardComponent)
      {
        this.showRouterChildWithFullDimentions=false;
        this.showingSidebarAccount=true;
        this.showingSidebarAdminMode=false;
        this.showingSidebarMedia=false;
      }
      if(event instanceof MovieListPage || event instanceof TvSerieListPage || event instanceof MenuListPage
        || event instanceof GenreListPage || event instanceof UserListPage || event instanceof RoleListPage)
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
