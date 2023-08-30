
import { ChangeDetectorRef, Component, HostListener} from '@angular/core';
import { SharedService } from 'src/app/modules/shared/services/shared-data.service';
import { UserService } from './modules/pages/users/shared/user.service';
import { NotFoundPage } from './modules/pages/not-found/not-found.page';
import { VideoPage } from './modules/pages/media/video/component/video.page';
import { LandingPage } from './modules/pages/landing/landing.page';
import { RecoverPasswordPage } from './modules/pages/recover-password/recover-password.page';
import { LoginPage } from './modules/pages/login/login.page';
import { ResetPasswordPage } from './modules/pages/reset-password/reset-password.page';
import { ConfirmEmailPage } from './modules/pages/confirm-email/confirm-email.page';
import { ProfilesViewPage } from './modules/pages/profiles/profiles-view/profiles-view.page';
import { RegisterUserPage } from './modules/pages/register-user/register-user.page';
import { SearchViewPage } from './modules/pages/media/search/search-view/search-view.page';
import { MediaItemsComponent } from './modules/pages/media/items/media-items.component';
import { MediaDetailComponent } from './modules/pages/media/detail/media-detail.component';
import { MyAccountPage } from './modules/pages/account-settings/my-account/my-account.page';
import { TranscoderSettingssPage } from './modules/pages/transcode-settings/transcode-settings.page';
import { ServerSettingsGeneralPage } from './modules/pages/server-settings-general/server-settings-general.page';
import { LibraryListComponent } from './modules/pages/libraries/library-list/library-list.component';
import { AlertsComponent } from './modules/pages/alerts/components/alerts/alerts.component';
import { MovieListPage } from './modules/pages/movies/movie-list/movie-list.page';
import { GenreListPage } from './modules/pages/genres/genre-list/genre-list.page';
import { UserListPage } from './modules/pages/users/user-list/user-list.page';
import { TvSerieListPage } from './modules/pages/tvseries/tvserie-list/tvserie-list.page';
import { RoleListPage } from './modules/pages/roles/role-list/role-list.page';
import { MenuListPage } from './modules/pages/menus/menu-list/menu-list.page';

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
    private userService:UserService,
    public ref: ChangeDetectorRef,
    public sharedService: SharedService) {}

    public ngOnInit(): void {
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
        this.sharedService.configurationData=(<any>window).configurationData;
      }
      if(localStorage.getItem('apiToken'))
      {
        this.sharedService.apiToken=localStorage.getItem('apiToken');
        this.userService.getUserData();
      }
    }

    ngAfterViewInit(){
      let ctx=this;
      let customClickEvent=function onCustomClick(event:any) {
        if(ctx.sharedService.configurationData.alwaysFullScreen)
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
      this.sharedService.showSplashScreen=false;
      if(event instanceof NotFoundPage || event instanceof VideoPage || event instanceof LoginPage || event instanceof RegisterUserPage
        || event instanceof RecoverPasswordPage || event instanceof ResetPasswordPage
        || event instanceof LandingPage || event instanceof ConfirmEmailPage || event instanceof ProfilesViewPage)
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
        event instanceof LibraryListComponent || event instanceof AlertsComponent)
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
