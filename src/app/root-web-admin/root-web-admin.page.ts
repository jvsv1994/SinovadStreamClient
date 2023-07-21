
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpMethodType } from '../enums';
import { ItemListPage } from '../item-list/item-list.page';
import { ManageMediaPage } from '../manage-media/manage-media.page';
import { Profile } from '../../models/profile';
import { MoviesPage } from '../movies/movies.page';
import { TvSeriesPage } from '../tvseries/tvseries.page';
import { HomePage } from '../home/home.page';
import { TvSerieDetailPage } from '../tvserie-detail/tvserie-detail.page';
import { MovieDetailPage } from '../movie-detail/movie-detail.page';
import { ProfilesViewPage } from '../profiles-view/profiles-view.page';
import { LoginPage } from '../login/login.page';
import { TranscoderSettingssPage } from '../transcode-settings/transcode-settings.page';
import { ServerSettingsGeneralPage } from '../server-settings-general/server-settings-general.page';
import { AccountPage } from '../account/account.page';
import { MenuListPage } from '../menu-list/menu-list.page';
import { TvSerieListPage } from '../tvserie-list/tvserie-list.page';
import { MovieListPage } from '../movie-list/movie-list.page';
import { GenreListPage } from '../genre-list/genre-list.page';
import { UserListPage } from '../user-list/user-list.page';
import { RoleListPage } from '../role-list/role-list.page';

@Component({
  selector: 'app-root-web-admin',
  templateUrl: './root-web-admin.page.html',
  styleUrls: ['./root-web-admin.page.scss']
})
export class RootWebAdminPage extends ParentComponent implements OnInit {

  @Output() toggleVideo= new EventEmitter();
  showVideoPopUp:boolean=false;
  showSplashScreen:boolean=false;
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

  constructor(
    public route: ActivatedRoute,
    public restProvider: RestProviderService,
    private router: Router,
    public  ref:ChangeDetectorRef,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

    public showVideoInFullScreen(){
      this.toggleVideo.emit(true);
    }


    public ngOnInit(): void {

    }

    public logOut(){
      this.restProvider.executeSinovadStreamServerService(HttpMethodType.DELETE,'/main/DeleteMediaServerData').then((response) => {

      },error=>{
        console.error(error);
      });
      this.sharedData.currentProfile=undefined;
      this.sharedData.userData=undefined;
      this.sharedData.currentToken=undefined;
      localStorage.removeItem("apiKey");
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
      this.sharedData.currentVideo=undefined;
      this.showHome();
      this.toggleVideo.emit(false);
    }

    public onActivate(event:any){
      let ctx=this;
      if(event instanceof MoviesPage || event instanceof TvSeriesPage || event instanceof HomePage || event instanceof MovieDetailPage || event instanceof TvSerieDetailPage)
      {
        this.showingSidebarMedia=true;
        this.showingSidebarAccount=false;
        this.showingSidebarAdminMode=false;
        event.toggleVideo.subscribe(event => {
          ctx.toggleVideo.emit(event);
        });
      }
      if(event instanceof ProfilesViewPage)
      {
        this.showingSidebarMedia=true;
        this.showingSidebarAccount=false;
        this.showingSidebarAdminMode=false;
        event.selectProfile.subscribe((profile:Profile) => {
          ctx.sharedData.currentProfile=profile;
          ctx.showHome();
        });
        event.loadedProfiles.subscribe(event => {
          ctx.showSplashScreen=false;
        });
      }
      if(event instanceof LoginPage)
      {
        event.showSplashScreen.subscribe(event => {
          ctx.showSplashScreen=true;
        });
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
      if(event instanceof ItemListPage)
      {
        this.showingSidebarAccount=false;
        this.showingSidebarAdminMode=true;
        this.showingSidebarMedia=false;
        event.currentMediaTypeID=ctx.currentMediaTypeID;
        event.title=this.title;
        ctx.ref.detectChanges();
      }
      if(event instanceof MenuListPage || event instanceof TvSerieListPage || event instanceof MovieListPage || event instanceof GenreListPage || event instanceof UserListPage || event instanceof RoleListPage)
      {
        this.showingSidebarAccount=false;
        this.showingSidebarAdminMode=true;
        this.showingSidebarMedia=false;
      }
    }
}
