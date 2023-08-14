
import { ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { MediaType, MetadataAgents } from 'src/app/shared/enums';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaGeneric } from 'src/app/shared/generics/media.generic';
import { LibraryService } from 'src/app/libraries/shared/library.service';
import { ItemDetail } from '../shared/models/item-detail.model';
import { MediaEpisode } from '../shared/models/media-episode.model';
import { MediaSeason } from '../shared/models/media-season.model';

declare var window;
@Component({
  selector: 'app-media-detail',
  templateUrl: './media-detail.component.html',
  styleUrls: ['./media-detail.component.scss']
})
export class MediaDetailComponent extends MediaGeneric implements OnInit {

  _window=window;
  detail:ItemDetail;
  listGenresByItem:any[];
  startResize:boolean=false;
  itemUserData:any;
  listEpisodePreference:any[];
  lastEpisodeWatched:any;

  constructor(
    private libraryService:LibraryService,
    public activeRoute: ActivatedRoute,
    public router: Router,
    private  ref:ChangeDetectorRef,
    public sharedService: SharedService) {
      super(router,activeRoute,sharedService)

    }

    ngOnInit(): void {
      if(!localStorage.getItem('apiToken'))
      {
        this.router.navigateByUrl('/landing');
      }
      this.initializeHeaderData();
      let mediaId = this.activeRoute.snapshot.queryParams['mediaId'];
      if(mediaId)
      {
        this.libraryService.getMediaItemDetail(this.mediaServer.Url,mediaId).then((detail:ItemDetail) => {
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
        return this.sharedService.urlEpisodeDataBase+episode.PosterPath;
      }else{
        return this.sharedService.getUrlByItemDetailMovieDataBase(this.detail);
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
