
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { Router } from '@angular/router';
import { HttpMethodType } from '../enums';
import { ItemListPage } from '../item-list/item-list.page';
import { ManageMediaPage } from '../manage-media/manage-media.page';
import { Profile } from '../models/profile';
import { MoviesPage } from '../movies/movies.page';
import { TvSeriesPage } from '../tvseries/tvseries.page';
import { HomePage } from '../home/home.page';
import { TvSerieDetailPage } from '../tvserie-detail/tvserie-detail.page';
import { MovieDetailPage } from '../movie-detail/movie-detail.page';
import { ProfilesViewPage } from '../profiles-view/profiles-view.page';
import { LoginPage } from '../login/login.page';
import { Menu } from '../models/menu';

@Component({
  selector: 'app-root-desktop',
  templateUrl: './root-desktop.page.html',
  styleUrls: ['./root-desktop.page.scss']
})
export class RootDesktopPage extends ParentComponent implements OnInit {

  @Output() toggleVideo= new EventEmitter();
  showVideoPopUp:boolean=false;
  showSplashScreen:boolean=false;
  hideContent:boolean=false;
  _window=window;
  currentMediaTypeID:number;
  title:string;
  selectedSidebarOption:Menu;
  isCollapsedSidebar:boolean=false;
  selectHomeUserOption=new EventEmitter<boolean>();
  unselectSidebarOption=new EventEmitter<boolean>();
  refreshSidebarOption=new EventEmitter<boolean>();

  constructor(
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
      if(this.sharedData.configurationData.currentHost!=null)
      {
        this.restProvider.executeSinovadStreamServerService(HttpMethodType.DELETE,'/main/DeleteMediaServerData').then((response) => {

        },error=>{
          console.error(error);
        });
      }
      this.sharedData.currentMediaServerData=undefined;
      this.sharedData.currentProfile=undefined;
      this.sharedData.userData=undefined;
      this.sharedData.currentToken=undefined;
      localStorage.removeItem("apiKey");
      this.router.navigate([this.sharedData.platform,'landing'],{ skipLocationChange: false});
    }

    public toogleMenu(){
      this.ref.detectChanges();
    }

    public onClickToggleSidebarButton(){
      this.isCollapsedSidebar=!this.isCollapsedSidebar;
    }

    public onClickSidebarOption(option:Menu){
      this.prepareRouterOutlet();
      this.router.navigateByUrl("/"+this.sharedData.platform+option.Path).then((response) => {
        this.selectedSidebarOption=option;
        if(this.isSmallDevice())
        {
          this.isCollapsedSidebar=true;
        }
      },error=>{
        console.error(error);
      });
    }


    public prepareRouterOutlet(){
      this.hideContent=true;
      this.ref.detectChanges();
      this.hideContent=false;
      this.ref.detectChanges();
    }

    public refresh(){
      if(this.selectedSidebarOption!=undefined)
      {
        this.prepareRouterOutlet();
        this.refreshSidebarOption.emit(true);
        this.router.navigateByUrl("/"+this.sharedData.platform+this.selectedSidebarOption.Path);
      }
    }

    public ShowInitial(){
      this.hideContent=true;
      this.ref.detectChanges();
      this.hideContent=false;
      this.ref.detectChanges();
      this.router.navigate([this.sharedData.platform,'home'],{ skipLocationChange: false});
    }

    public ShowSearch(){
      this.hideContent=true;
      this.ref.detectChanges();
      this.hideContent=false;
      this.router.navigate([this.sharedData.platform,'search'],{ skipLocationChange: false});
    }

    public onSearchMedia(searchText:string){
      if(searchText!=undefined && searchText!='')
      {
        this.unselectSidebarOption.emit(true);
        this.hideContent=true;
        this.ref.detectChanges();
        this.hideContent=false;
        this.router.navigate([this.sharedData.platform,"search"],{queryParams:{text:searchText},skipLocationChange: false});
      }else{
        this.ShowInitial();
      }
    }

    public closeVideo(){
      this.sharedData.currentVideo=undefined;
      this.ShowInitial();
      this.toggleVideo.emit(false);
    }

    public onActivate(event:any){
      let ctx=this;
      if(event instanceof MoviesPage || event instanceof TvSeriesPage || event instanceof HomePage || event instanceof MovieDetailPage || event instanceof TvSerieDetailPage)
      {
        event.toggleVideo.subscribe(event => {
          ctx.toggleVideo.emit(event);
        });
      }
      if(event instanceof ProfilesViewPage)
      {
        event.selectProfile.subscribe((profile:Profile) => {
          ctx.sharedData.currentProfile=profile;
          ctx.router.navigate([this.sharedData.platform,'home'],{ skipLocationChange: false});
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
      if(event instanceof ItemListPage)
      {
        event.currentMediaTypeID=ctx.currentMediaTypeID;
        event.title=this.title;
        ctx.ref.detectChanges();
      }
      if(event instanceof ManageMediaPage)
      {
        event.showInitial.subscribe(event => {
          ctx.ShowInitial();
        });
      }
    }
}
