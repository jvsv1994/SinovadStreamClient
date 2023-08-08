
import { ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HomePage } from '../media/home/home.page';
import { TranscoderSettingssPage } from '../transcode-settings/transcode-settings.page';
import { ServerSettingsGeneralPage } from '../server-settings-general/server-settings-general.page';
import { AccountPage } from '../account/account.page';
import { GenreListPage } from '../genres/genre-list/genre-list.page';
import { Subscription } from 'rxjs';
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
import { VideoService } from '../media/video/service/video.service';
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
export class WebContainerPage extends ParentComponent implements OnInit,OnDestroy {

  showVideoPopUp:boolean=false;
  _window=window;
  currentMediaTypeID:number;
  title:string;
  isCollapsedSidebar:boolean=false;
  showingSidebarAccount:boolean=false;
  showingSidebarAdminMode:boolean=false;
  showingSidebarMedia:boolean=false;
  subscriptionVideo:Subscription;
  showRouterChildWithFullDimentions:boolean=true;

  constructor(
    public videoService: VideoService,
    public route: ActivatedRoute,
    public restProvider: RestProviderService,
    private router: Router,
    public  ref:ChangeDetectorRef,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)
      this.subscriptionVideo=this.videoService.isClosedVideo().subscribe(()=>{
         this.goHome();
      });
    }


    public ngOnInit(): void {

    }

    public ngOnDestroy(): void {
      this.subscriptionVideo.unsubscribe();
    }

    public logOut(){
      this.sharedData.currentProfile=undefined;
      this.sharedData.userData=undefined;
      this.sharedData.apiToken=undefined;
      localStorage.removeItem("apiToken");
      this.router.navigate(['landing'],{ skipLocationChange: false});
    }

    public toogleMenu(){
      this.ref.detectChanges();
    }

    public onClickToggleSidebarButton(){
      this.isCollapsedSidebar=!this.isCollapsedSidebar;
    }

    public showAdminMode(){
      this.showingSidebarAdminMode=true;
      this.showingSidebarAccount=false;
      this.showingSidebarMedia=false;
    }

    public goHome(){
      this.router.navigateByUrl("/home");
    }

    public onSearchMedia(searchText:string){
      if(searchText!=undefined && searchText!='')
      {
        this.router.navigateByUrl("/search?text="+searchText);
      }else{
        this.goHome();
      }
    }

    public onActivate(event:any){
      let ctx=this;
      this.isCollapsedSidebar=true;
      this.sharedData.showSplashScreen=false;
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
        ctx.ref.detectChanges();
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
