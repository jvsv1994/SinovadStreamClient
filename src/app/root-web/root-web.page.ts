
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpMethodType } from '../Enums';
import { NavbarOption } from '../models/navbarOption';
import { ProfilesViewPage } from '../profiles-view/profiles-view.page';
import { Profile } from '../models/profile';
import { MoviesPage } from '../movies/movies.page';
import { TvSeriesPage } from '../tvseries/tvseries.page';
import { HomePage } from '../home/home.page';
import { MovieDetailPage } from '../movie-detail/movie-detail.page';
import { TvSerieDetailPage } from '../tvserie-detail/tvserie-detail.page';
import { LoginPage } from '../login/login.page';

@Component({
  selector: 'app-root-web',
  templateUrl: './root-web.page.html',
  styleUrls: ['./root-web.page.scss']
})
export class RootWebPage extends ParentComponent implements OnInit {

  @Output() toggleVideo= new EventEmitter();
  showVideoPopUp:boolean=false;
  showSplashScreen:boolean=false;
  hideContent:boolean=false;
  _window=window;
  selectedNavbarOption:NavbarOption;

  constructor(
    private route:ActivatedRoute,
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
        this.restProvider.executeSinovadStreamServerService(HttpMethodType.DELETE,'/main/DeleteHostData').then((response) => {

        },error=>{
          console.error(error);
        });
      }
      this.sharedData.currentAccountServerData=undefined;
      this.sharedData.currentProfile=undefined;
      this.sharedData.accountData=undefined;
      this.sharedData.currentToken=undefined;
      localStorage.removeItem("apiKey");
      this.router.navigate([this.sharedData.platform,'landing'],{ skipLocationChange: false});
    }

    public toogleMenu(){
      this.ref.detectChanges();
    }

    public executeSearch(){

    }

    public onClickNavbarOption(option:NavbarOption){
      this.selectedNavbarOption=option;
      this[option.method]();
    }

    public refresh(){
      if(this.selectedNavbarOption)
      {
        this[this.selectedNavbarOption.method]();
      }
      this.ref.detectChanges();
    }

    public ShowInitial(){
      this.hideContent=true;
      this.ref.detectChanges();
      this.hideContent=false;
      this.ref.detectChanges();
      this.router.navigate([this.sharedData.platform,'home'],{ skipLocationChange: false});
    }

    public ShowSeries(){
      this.hideContent=true;
      this.ref.detectChanges();
      this.hideContent=false;
      this.ref.detectChanges();
      this.router.navigate([this.sharedData.platform,'tvseries'],{ skipLocationChange: false});
    }

    public ShowMovies(){
      this.hideContent=true;
      this.ref.detectChanges();
      this.hideContent=false;
      this.ref.detectChanges();
      this.router.navigate([this.sharedData.platform,'movies'],{ skipLocationChange: false});
    }

    public ShowSearch(){
      this.hideContent=true;
      this.ref.detectChanges();
      this.hideContent=false;
      this.router.navigate([this.sharedData.platform,'search'],{ skipLocationChange: false});
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
        event.loadedProfiles.subscribe((listProfiles:Profile[]) => {
          ctx.showSplashScreen=false;
        });
      }
      if(event instanceof LoginPage)
      {
        event.showSplashScreen.subscribe(event => {
          ctx.showSplashScreen=true;
        });
      }
    }

}
