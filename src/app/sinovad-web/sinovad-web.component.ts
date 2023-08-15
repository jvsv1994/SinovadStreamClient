
import { ChangeDetectorRef, Component, HostListener} from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { MediaServerService } from '../servers/shared/server.service';
import { ProfileService } from '../profiles/shared/profile.service';
import { UserService } from '../users/shared/user.service';
import { MenuService } from '../menus/shared/menu.service';
import { LibraryService } from '../libraries/shared/library.service';
@Component({
  selector: 'app-sinovad-web',
  templateUrl: './sinovad-web.component.html',
  styleUrls: ['./sinovad-web.component.scss']
})
export class SinovadWebComponent{

  showRootPage:boolean=false;

  constructor(
    private libraryService:LibraryService,
    private menuService:MenuService,
    private userService:UserService,
    private profileService:ProfileService,
    private serverService: MediaServerService,
    public ref: ChangeDetectorRef,
    public sharedService: SharedService) {

    }

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
        this.userService.getUser().then(res=>{
          var responseMediaServers:boolean=false;
          var responseProfiles:boolean=false;
          var responseManageMenu:boolean=false;
          this.menuService.getManageMenu().then(response=>{
            responseManageMenu=true;
            if(responseMediaServers && responseProfiles && responseManageMenu)
            {
              this.showRootPage=true;
              this.ref.detectChanges();
            }
          },error=>{

          });
          this.serverService.getMediaServers().then(response=>{
            responseMediaServers=true;
            if(responseMediaServers && responseProfiles && responseManageMenu)
            {
              this.showRootPage=true;
              this.ref.detectChanges();
            }
          },error=>{

          });
          this.profileService.getAllProfiles().then(response=>{
            responseProfiles=true;
            if(responseMediaServers && responseProfiles && responseManageMenu)
            {
              this.showRootPage=true;
              this.ref.detectChanges();
            }
          },error=>{

          });
        },error=>{
          console.error(error);
        });
        this.ref.detectChanges();
      }else{
        this.sharedService.apiToken=undefined;
        setTimeout(() => {
          this.showRootPage=true;
          this.ref.detectChanges();
        }, 100);
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

    @HostListener('window:resize', ['$event'])
    onResize(event) {

    }
}
