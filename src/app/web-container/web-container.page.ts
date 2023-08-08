
import { Component} from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { HomePage } from '../media/home/home.page';
import { TranscoderSettingssPage } from '../transcode-settings/transcode-settings.page';
import { ServerSettingsGeneralPage } from '../server-settings-general/server-settings-general.page';
import { AccountPage } from '../account/account.page';
import { GenreListPage } from '../genres/genre-list/genre-list.page';
import { UserListPage } from '../users/user-list/user-list.page';
import { RoleListPage } from '../roles/role-list/role-list.page';
import { MenuListPage } from '../menus/menu-list/menu-list.page';
import { MovieListPage } from '../movies/movie-list/movie-list.page';
import { TvSerieListPage } from '../tvseries/tvserie-list/tvserie-list.page';
import { LibraryListComponent } from '../libraries/library-list/library-list.component';
import { ProfilesViewPage } from '../profiles/profiles-view/profiles-view.page';
import { MediaMoviesPage } from '../media/media-movies/media-movies.page';
import { MediaTvSeriesPage } from '../media/media-tvseries/media-tvseries.page';
import { SearchViewPage } from '../media/search/search-view/search-view.page';
import { MovieDetailPage } from '../media/detail/movie-detail/movie-detail.page';
import { TvSerieDetailPage } from '../media/detail/tvserie-detail/tvserie-detail.page';
import { NotFoundPage } from '../not-found/not-found.page';
import { LoginPage } from '../login/login.page';
import { RegisterUserPage } from '../register-user/register-user.page';
import { RecoverPasswordPage } from '../recover-password/recover-password.page';
import { ResetPasswordPage } from '../reset-password/reset-password.page';
import { LandingPage } from '../landing/landing.page';
import { ConfirmEmailPage } from '../confirm-email/confirm-email.page';
import { MediaServerComponent } from '../media/media-server/media-server.component';

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
      if(event instanceof NotFoundPage || event instanceof LoginPage || event instanceof RegisterUserPage || event instanceof RecoverPasswordPage || event instanceof ResetPasswordPage
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
      if(event instanceof MediaServerComponent || event instanceof MediaMoviesPage || event instanceof MediaTvSeriesPage || event instanceof HomePage || event instanceof MovieDetailPage || event instanceof TvSerieDetailPage)
      {
        this.showRouterChildWithFullDimentions=false;
        this.showingSidebarMedia=true;
        this.showingSidebarAccount=false;
        this.showingSidebarAdminMode=false;
      }
      if(event instanceof AccountPage)
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
}
