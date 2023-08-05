
import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageMediaPage } from '../manage-media/manage-media.page';
import { HomePage } from '../home/home.page';
import { TvSerieDetailPage } from '../tvserie-detail/tvserie-detail.page';
import { MovieDetailPage } from '../movie-detail/movie-detail.page';
import { ProfilesViewPage } from '../profiles-view/profiles-view.page';
import { TranscoderSettingssPage } from '../transcode-settings/transcode-settings.page';
import { ServerSettingsGeneralPage } from '../server-settings-general/server-settings-general.page';
import { AccountPage } from '../account/account.page';
import { GenreListPage } from '../genres/genre-list/genre-list.page';
import { SearchViewRootPage } from '../search-view-root/search-view-root.page';
import { BuilderVideo } from 'src/models/builderVideo';
import { VideoEvent, VideoService } from 'src/app/shared/services/video.service';
import { Subscription } from 'rxjs';
import { UserListPage } from '../users/user-list/user-list.page';
import { RoleListPage } from '../roles/role-list/role-list.page';
import { MenuListPage } from '../menus/menu-list/menu-list.page';
import { MediaMoviesPage } from '../media-movies/media-movies.page';
import { MediaTvSeriesPage } from '../media-tvseries/media-tvseries.page';
import { MovieListPage } from '../movies/movie-list/movie-list.page';
import { TvSerieListPage } from '../tvseries/tvserie-list/tvserie-list.page';

@Component({
  selector: 'app-web-container',
  templateUrl: './web-container.page.html',
  styleUrls: ['./web-container.page.scss']
})
export class WebContainerPage extends ParentComponent implements OnInit,OnDestroy {

  @Output() toggleVideo= new EventEmitter();
  showVideoPopUp:boolean=false;
  hideContent:boolean=false;
  _window=window;
  currentMediaTypeID:number;
  title:string;
  isCollapsedSidebar:boolean=false;
  selectHomeUserOption=new EventEmitter<boolean>();
  unselectSidebarOption=new EventEmitter<boolean>();
  refreshSidebarOption=new EventEmitter<boolean>();
  showingSidebarAccount:boolean=false;
  showingSidebarAdminMode:boolean=false;
  showingSidebarMedia:boolean=false;
  currentVideo:BuilderVideo;
  subscriptionVideo:Subscription;

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
      this.subscriptionVideo=this.videoService.getVideoEvent().subscribe((videoEvent:VideoEvent)=>{
          if(videoEvent.isShowing)
          {
            this.currentVideo=videoEvent.builderVideo;
            this.toggleVideo.emit(true);
          }else{
            this.currentVideo=undefined;
            this.toggleVideo.emit(false);
          }
      });
    }

    public showVideoInFullScreen(){
      this.toggleVideo.emit(true);
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

    public prepareRouterOutlet(){
      this.hideContent=true;
      this.ref.detectChanges();
      this.hideContent=false;
      this.ref.detectChanges();
    }

    public refresh(){
      this.refreshSidebarOption.emit(true);
    }

    public showAdminMode(){
      this.showingSidebarAdminMode=true;
      this.showingSidebarAccount=false;
      this.showingSidebarMedia=false;
    }

    public showHome(){
      this.showingSidebarAccount=false;
      this.router.navigateByUrl("/home").then((response) => {
        if(this.isSmallDevice())
        {
          this.isCollapsedSidebar=true;
        }
        this.prepareRouterOutlet();
        this.selectHomeUserOption.emit(true);
      },error=>{
        console.error(error);
      });
    }

    public onSearchMedia(searchText:string){
      if(searchText!=undefined && searchText!='')
      {
        this.unselectSidebarOption.emit(true);
        this.hideContent=true;
        this.ref.detectChanges();
        this.router.navigateByUrl("/search?text="+searchText).then(res=>
          {
            this.hideContent=false;
            this.ref.detectChanges();
          }
        );
      }else{
        this.showHome();
      }
    }

    public closeVideo(){
      this.currentVideo=undefined;
      this.showHome();
      this.toggleVideo.emit(false);
    }

    public onActivate(event:any){
      let ctx=this;
      this.isCollapsedSidebar=true;
      this.sharedData.showSplashScreen=false;
      if(event instanceof SearchViewRootPage)
      {
        this.showingSidebarMedia=true;
        this.showingSidebarAccount=false;
        this.showingSidebarAdminMode=false;
      }
      if(event instanceof MediaMoviesPage || event instanceof MediaTvSeriesPage || event instanceof HomePage || event instanceof MovieDetailPage || event instanceof TvSerieDetailPage)
      {
        this.showingSidebarMedia=true;
        this.showingSidebarAccount=false;
        this.showingSidebarAdminMode=false;
      }
      if(event instanceof ProfilesViewPage)
      {
        this.showingSidebarMedia=true;
        this.showingSidebarAccount=false;
        this.showingSidebarAdminMode=false;
      }
      if(event instanceof AccountPage)
      {
        this.showingSidebarAccount=true;
        this.showingSidebarAdminMode=false;
        this.showingSidebarMedia=false;
      }
      if(event instanceof TranscoderSettingssPage)
      {
        this.showingSidebarAccount=true;
        this.showingSidebarAdminMode=false;
        this.showingSidebarMedia=false;
      }
      if(event instanceof ServerSettingsGeneralPage)
      {
        this.showingSidebarAccount=true;
        this.showingSidebarAdminMode=false;
        this.showingSidebarMedia=false;
      }
      if(event instanceof ManageMediaPage)
      {
        this.showingSidebarAccount=true;
        this.showingSidebarAdminMode=false;
        this.showingSidebarMedia=false;
        event.showInitial.subscribe(event => {
          ctx.showHome();
        });
      }
      if(event instanceof MovieListPage || event instanceof TvSerieListPage)
      {
        this.showingSidebarAccount=false;
        this.showingSidebarAdminMode=true;
        this.showingSidebarMedia=false;
        ctx.ref.detectChanges();
      }
      if(event instanceof MenuListPage || event instanceof TvSerieListPage || event instanceof MovieListPage
        || event instanceof GenreListPage || event instanceof UserListPage || event instanceof RoleListPage)
      {
        this.showingSidebarAccount=false;
        this.showingSidebarAdminMode=true;
        this.showingSidebarMedia=false;
      }
    }
}
