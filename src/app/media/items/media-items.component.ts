
import { ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpMethodType, MediaType } from 'src/app/shared/enums';
import { Item } from '../shared/item.model';
import { ItemDetail } from '../shared/item-detail.model';
import { SinovadApiGenericResponse } from 'src/app/response/sinovadApiGenericResponse';
import { ItemsGroup } from '../shared/items-group.model';
import { VideoService } from '../video/service/video.service';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { MediaGeneric } from 'src/app/shared/generics/media.generic';
import { LibraryService } from 'src/app/libraries/shared/library.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-media-server',
  templateUrl: './media-items.component.html',
  styleUrls: ['./media-items.component.scss']
})
export class MediaItemsComponent extends MediaGeneric implements OnInit,OnDestroy {

  showLoadingApp:boolean=true;
  listItems: any[];
  itemsGroupList:ItemsGroup[]=[];
  _window=window;
  subscriptionUpdatingLibraries:Subscription;

  constructor(
    private libraryService:LibraryService,
    public activeRoute: ActivatedRoute,
    private router: Router,
    private videoService:VideoService,
    public restProvider: RestProviderService,
    private  ref:ChangeDetectorRef,
    public sharedService: SharedService) {
      super(activeRoute,sharedService);
      this.subscriptionUpdatingLibraries=this.libraryService.isUpdatingLibraries().subscribe((res)=>{
        this.initializeData();
      });
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
    }

    public ngOnInit(): void {
      this.initializeData();
    }

    ngAfterViewInit(){
    }

    ngOnDestroy(){
      this.subscriptionUpdatingLibraries.unsubscribe();
    }

    public initializeData(): void {
      if(this.sharedService.mediaServers && this.sharedService.mediaServers.length>0 && this.sharedService.mediaServers.findIndex(x=>x.ListLibraries!=null && x.ListLibraries.length>0)!=-1)
      {
        if(window.location.pathname.endsWith("home"))
        {
          this.sharedService.mediaServers.forEach(ms => {
            try{
              this.libraryService.getAllMediaItems(ms.Url,this.sharedService.currentProfile.Id).then((itemsGroupList:ItemsGroup[])=>{
                this.itemsGroupList=this.itemsGroupList.concat(itemsGroupList);
              },error=>{

              });
            }catch(e){

            }
          });
        }else if(window.location.pathname.endsWith("movies")){
          this.title="Películas";
          this.sharedService.mediaServers.forEach(ms => {
            this.libraryService.getMediaItemsByMediaType(ms.Url,MediaType.Movie,this.sharedService.currentProfile.Id).then((itemsGroupList:ItemsGroup[])=>{
              this.itemsGroupList=this.itemsGroupList.concat(itemsGroupList);
            },error=>{
              console.error(error);
            });
          });
        }else if(window.location.pathname.endsWith("tvseries")){
          this.title="Series de TV"
          this.sharedService.mediaServers.forEach(ms => {
            this.libraryService.getMediaItemsByMediaType(ms.Url,MediaType.TvSerie,this.sharedService.currentProfile.Id).then((itemsGroupList:ItemsGroup[])=>{
              this.itemsGroupList=this.itemsGroupList.concat(itemsGroupList);
            },error=>{
              console.error(error);
            });
          });
        }else{
          this.initializeHeaderData();
          if(this.mediaServer!=null)
          {
            if(this.library!=null)
            {
              this.libraryService.getMediaItemsByLibrary(this.mediaServer.Url,this.library.Id,this.sharedService.currentProfile.Id).then((itemsGroupList:ItemsGroup[])=>{
                this.itemsGroupList=this.itemsGroupList.concat(itemsGroupList);
              },error=>{
                console.error(error);
              });
            }else{
              this.libraryService.getAllMediaItems(this.mediaServer.Url,this.sharedService.currentProfile.Id).then((itemsGroupList:ItemsGroup[])=>{
                this.itemsGroupList=this.itemsGroupList.concat(itemsGroupList);
              },error=>{
                console.error(error);
              });
            }
          }
        }
      }
    }


    public getWidthProgressItem(item:Item){
      let widthProgressBarPercentaje=(item.CurrentTime/item.DurationTime)*100;
      return widthProgressBarPercentaje+'%';
    }

    public onClickButtonLeftScroll(itemsRowContainer:any,scrollLeftButton:any,scrollRightButton:any){
      itemsRowContainer.scrollLeft=itemsRowContainer.scrollLeft-300;
      this.verifyIfShoOrHiddenScrollButtons(itemsRowContainer,scrollLeftButton,scrollRightButton);
    }

    public onClickButtonRightScroll(itemsRowContainer:any,scrollLeftButton:any,scrollRightButton:any){
      itemsRowContainer.scrollLeft=itemsRowContainer.scrollLeft+300;
      this.verifyIfShoOrHiddenScrollButtons(itemsRowContainer,scrollLeftButton,scrollRightButton);
    }

    public verifyIfShoOrHiddenScrollButtons(itemsRowContainer:any,scrollLeftButton:any,scrollRightButton:any){
      if(itemsRowContainer.scrollLeft<=0)
      {
        scrollLeftButton.style.display="none";
      }else{
        scrollLeftButton.style.display="flex";
      }
      if(itemsRowContainer.scrollWidth==itemsRowContainer.scrollLeft+itemsRowContainer.offsetWidth)
      {
        scrollRightButton.style.display="none";
      }else{
        scrollRightButton.style.display="flex";
      }
      this.ref.detectChanges();
    }

    public onInitializeItemsRow(itemsRowContainer:any,scrollLeftButton:any,scrollRightButton:any){
      setTimeout(() => {
        this.verifyIfShoOrHiddenScrollButtons(itemsRowContainer,scrollLeftButton,scrollRightButton);
      }, 250);
    }

    public onClickItem(item: Item)
    {
      if(item.CurrentTime!=undefined && item.CurrentTime>0)
      {
        this.continueVideoByItem(item);
      }else{
        this.getMediaItemDetail(item);
      }
    }

    public getMediaItemDetail(item:Item){
      var mediaServer=this.sharedService.mediaServers.find(x=>x.Id==item.MediaServerId);
      this.router.navigateByUrl('/media/server/'+mediaServer.Guid+"/libraries/"+item.LibraryId+"/detail?mediaType="+item.MediaTypeId+"&mediaId="+item.MediaItemId);
    }

    public continueVideoByItem(item:Item){
      var mediaServer=this.sharedService.mediaServers.find(x=>x.Id==item.MediaServerId);
      this.libraryService.getMediaItemDetail(this.mediaServer.Url,item.MediaItemId).then((detail:ItemDetail) => {
        if(item.MediaEpisodeId!=undefined)
        {
          detail.CurrentSeason=detail.ListSeasons.find(x=>x.SeasonNumber==item.SeasonNumber);
          detail.CurrentEpisode=detail.CurrentSeason.ListEpisodes.find(x=>x.EpisodeNumber==item.EpisodeNumber);
          var builderVideo= this.libraryService.CreateBuilderVideoFromEpisode(detail,detail.CurrentEpisode,mediaServer,item.CurrentTime);
          this.videoService.show(builderVideo);
        }else{
          var builderVideo= this.libraryService.CreateBuilderVideoFromItem(detail,mediaServer,item.CurrentTime);
          this.videoService.show(builderVideo);
        }
      },error=>{
        console.error(error);
      });
    }

}
