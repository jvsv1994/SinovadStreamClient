
import { Component, HostListener} from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { TranscoderSettingssPage } from '../transcode-settings/transcode-settings.page';
import { ServerSettingsGeneralPage } from '../server-settings-general/server-settings-general.page';
import { GenreListPage } from '../genres/genre-list/genre-list.page';
import { UserListPage } from '../users/user-list/user-list.page';
import { RoleListPage } from '../roles/role-list/role-list.page';
import { MenuListPage } from '../menus/menu-list/menu-list.page';
import { MovieListPage } from '../movies/movie-list/movie-list.page';
import { TvSerieListPage } from '../tvseries/tvserie-list/tvserie-list.page';
import { LibraryListComponent } from '../libraries/library-list/library-list.component';
import { ProfilesViewPage } from '../profiles/profiles-view/profiles-view.page';
import { SearchViewPage } from '../media/search/search-view/search-view.page';
import { NotFoundPage } from '../not-found/not-found.page';
import { LoginPage } from '../login/login.page';
import { RegisterUserPage } from '../register-user/register-user.page';
import { RecoverPasswordPage } from '../recover-password/recover-password.page';
import { ResetPasswordPage } from '../reset-password/reset-password.page';
import { LandingPage } from '../landing/landing.page';
import { ConfirmEmailPage } from '../confirm-email/confirm-email.page';
import { MediaDetailComponent } from '../media/detail/media-detail.component';
import { MediaItemsComponent } from '../media/items/media-items.component';
import { VideoPage } from '../media/video/component/video.page';
import { MyAccountPage } from '../account-settings/my-account/my-account.page';

@Component({
  selector: 'app-web-container',
  templateUrl: './web-container.page.html',
  styleUrls: ['./web-container.page.scss']
})
export class WebContainerPage{

  _window=window;
  isCollapsedSidebar:boolean=false;
  showingSidebarAccount:boolean=false;
  showingSidebarAdminMode:boolean=false;
  showingSidebarMedia:boolean=false;
  showRouterChildWithFullDimentions:boolean=true;

  constructor(
    public sharedService: SharedService) {}

    public onClickToggleSidebarButton(){
      this.isCollapsedSidebar=!this.isCollapsedSidebar;
    }

    public onActivate(event:any){
      this.isCollapsedSidebar=true;
      this.sharedService.showSplashScreen=false;
      if(event instanceof NotFoundPage || event instanceof VideoPage || event instanceof LoginPage || event instanceof RegisterUserPage || event instanceof RecoverPasswordPage || event instanceof ResetPasswordPage
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
      if(event instanceof MyAccountPage)
      {
        this.showRouterChildWithFullDimentions=false;
        this.showingSidebarAccount=true;
        this.showingSidebarAdminMode=false;
        this.showingSidebarMedia=false;
      }
      if(event instanceof TranscoderSettingssPage)
      {
        this.showRouterChildWithFullDimentions=false;
        this.showingSidebarAccount=true;
        this.showingSidebarAdminMode=false;
        this.showingSidebarMedia=false;
      }
      if(event instanceof ServerSettingsGeneralPage)
      {
        this.showRouterChildWithFullDimentions=false;
        this.showingSidebarAccount=true;
        this.showingSidebarAdminMode=false;
        this.showingSidebarMedia=false;
      }
      if(event instanceof LibraryListComponent)
      {
        this.showRouterChildWithFullDimentions=false;
        this.showingSidebarAccount=true;
        this.showingSidebarAdminMode=false;
        this.showingSidebarMedia=false;
      }
      if(event instanceof MovieListPage || event instanceof TvSerieListPage)
      {
        this.showRouterChildWithFullDimentions=false;
        this.showingSidebarAccount=false;
        this.showingSidebarAdminMode=true;
        this.showingSidebarMedia=false;
      }
      if(event instanceof MenuListPage || event instanceof TvSerieListPage || event instanceof MovieListPage
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
