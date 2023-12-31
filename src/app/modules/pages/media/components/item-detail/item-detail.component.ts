
import { ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { MediaType, MetadataAgents } from 'src/app/modules/shared/enums/enums';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaGeneric } from 'src/app/modules/shared/generics/media.generic';
import { Subscription } from 'rxjs';
import { SignalIRHubService } from 'src/app/services/signal-ir-hub.service';
import { ItemDetail } from '../../models/item-detail.model';
import { MediaEpisode } from '../../models/media-episode.model';
import { MediaSeason } from '../../models/media-season.model';
import { MediaItemService } from '../../services/media-item.service';

declare var window;
@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent extends MediaGeneric implements OnInit {

  _window=window;
  detail:ItemDetail;
  listGenresByItem:any[];
  startResize:boolean=false;
  itemUserData:any;
  listEpisodePreference:any[];
  lastEpisodeWatched:any;
  subscription:Subscription= new Subscription();;
  loadingConnection:boolean=true;

  constructor(
    private signalIrService:SignalIRHubService,
    private mediaItemService:MediaItemService,
    public activeRoute: ActivatedRoute,
    public router: Router,
    private  ref:ChangeDetectorRef,
    public sharedDataService: SharedDataService) {
      super(router,activeRoute,sharedDataService)
      this.subscription.add(this.signalIrService.isEnablingMediaServer().subscribe((mediaServerGuid:string)=>{
        if(this.mediaServer && this.mediaServer.Guid==mediaServerGuid && !this.mediaServer.isSecureConnection)
        {
          this.loadingConnection=false;
          this.mediaServer.isSecureConnection=true;
          this.getMediaItemDetail();
        }
      }));
      this.subscription.add(this.signalIrService.isDisablingMediaServer().subscribe((mediaServerGuid:string)=>{
        if(this.mediaServer && this.mediaServer.Guid==mediaServerGuid && this.mediaServer.isSecureConnection)
        {
          this.mediaServer.isSecureConnection=false;
        }
      }));
    }

    ngOnInit(): void {
      this.initializeHeaderData();
      if(this.mediaServer)
      {
        if(this.mediaServer.isSecureConnection)
        {
          this.loadingConnection=false;
          this.getMediaItemDetail();
        }else{
          setTimeout(() => {
            this.loadingConnection=false;
          }, 3000);
        }
      }else{
        this.router.navigateByUrl('/404')
      }
    }

    ngOnDestroy(){
      this.subscription.unsubscribe();
    }

    private getMediaItemDetail(){
      let mediaId = this.activeRoute.snapshot.queryParams['mediaId'];
      if(mediaId)
      {
        this.mediaItemService.getMediaItemDetail(this.mediaServer.Url,mediaId).then((detail:ItemDetail) => {
          this.detail=detail;
          this.detail.CurrentSeason=this.detail.ListSeasons[0];
        },error=>{
          this.router.navigate(['404'],{ skipLocationChange: false});
        });
      }else{
        this.router.navigate(['404'],{ skipLocationChange: false});
      }
    }

    public getEpisodeImagePath(episode:MediaEpisode){
      if(this.detail.MediaItem.MetadataAgentsId==MetadataAgents.TMDb && episode.PosterPath){
        return this.sharedDataService.urlEpisodeDataBase+episode.PosterPath;
      }else{
        if(episode.ListMediaFiles && episode.ListMediaFiles.length>0)
        {
          var mediaFile=episode.ListMediaFiles[0];
          return this.mediaServer.Url+"/media/"+mediaFile.Guid+"/thumbnail.png";
        }else{
          return "assets/img/no-image-available.jpg";
        }
      }
    }

    public getUrlByItemDetailMovieDataBase(detail:ItemDetail){
      if(detail.MediaItem.MetadataAgentsId==MetadataAgents.TMDb)
      {
        return this.sharedDataService.originalUrlImagesMovieDataBase+detail.MediaItem.PosterPath;
      }else{
        if(detail.MediaItem.PosterPath)
        {
          return detail.MediaItem.PosterPath;
        }else{
          if(detail.ListMediaFiles && detail.ListMediaFiles.length>0)
          {
            var mediaFile=detail.ListMediaFiles[0];
            return this.mediaServer.Url+"/media/"+mediaFile.Guid+"/thumbnail.png";
          }else{
            return "assets/img/no-image-available.jpg";
          }
        }
      }
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

    public onClickButtonLeftScroll(itemsRowContainer:any,scrollLeftButton:any,scrollRightButton:any){
      itemsRowContainer.scrollLeft=itemsRowContainer.scrollLeft-20;
      this.verifyIfShoOrHiddenScrollButtons(itemsRowContainer,scrollLeftButton,scrollRightButton);
    }

    public onClickButtonRightScroll(itemsRowContainer:any,scrollLeftButton:any,scrollRightButton:any){
      itemsRowContainer.scrollLeft=itemsRowContainer.scrollLeft+20;
      this.verifyIfShoOrHiddenScrollButtons(itemsRowContainer,scrollLeftButton,scrollRightButton);
    }

    public getWidthProgressItem(item:any){
      let widthProgressBarPercentaje=(item.CurrentTime/item.DurationTime)*100;
      return widthProgressBarPercentaje+'%';
    }



    public continueVideo(){
      /*
      if(this.lastEpisodeWatched)
      {

      }else{
        if(this.itemUserData)
        {
          this.getVideosByItem(this.itemUserData.CurrentTime);
        }
      }*/
    }

    public showVideo(){
      if(this.detail.MediaItem.MediaTypeId==MediaType.Movie)
      {
        this.getVideosByItem();
      }else{
        if(this.detail.ListSeasons && this.detail.ListSeasons.length>0)
        {
         let season=this.detail.ListSeasons[0];
         if(season.ListEpisodes && season.ListEpisodes.length>0)
         {
          this.getVideoByEpisode(season.ListEpisodes[0]);
         }
        }
      }
    }

    public getVideosByItem(){
      var mediaFile=this.detail.ListMediaFiles[0];
      this.router.navigateByUrl('/media/server/'+this.mediaServer.Guid+"/video/"+mediaFile.Id);
    }

    public onClickSeason(item:MediaSeason){
      this.detail.CurrentSeason=item;
    }

    public onClickEpisode(episode:MediaEpisode){
      this.getVideoByEpisode(episode);
    }

    public getVideoByEpisode(episode:MediaEpisode){
      var mediaFile=episode.ListMediaFiles[0];
      this.router.navigateByUrl('/media/server/'+this.mediaServer.Guid+"/video/"+mediaFile.Id);
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
      setTimeout(() => {
        this.startResize=true;
        this.ref.detectChanges();
        this.startResize=false;
        this.ref.detectChanges();
      }, 100);
    }


}
