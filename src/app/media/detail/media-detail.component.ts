
import { ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { MediaType, MetadataAgents } from 'src/app/shared/enums';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemDetail } from '../shared/item-detail.model';
import { VideoService } from '../video/service/video.service';
import { MediaGeneric } from 'src/app/shared/generics/media.generic';
import { LibraryService } from 'src/app/libraries/shared/library.service';
import { MediaSeason } from '../shared/media-season.model';
import { MediaEpisode } from '../shared/media-episode.model';
import {v4 as uuid} from "uuid";
import { TranscodePrepareVideo } from '../video/models/transcodePrepareVideo';
import { BuilderVideo } from '../video/models/builderVideo';

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
    private router: Router,
    private videoService:VideoService,
    private  ref:ChangeDetectorRef,
    public sharedService: SharedService) {
      super(activeRoute,sharedService)

    }

    ngOnInit(): void {
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

    public getEpisodeImagePath(episode:any){
      if(this.detail.MediaItem.MetadataAgentsId==MetadataAgents.TMDb && episode.StillPath){
        return this.sharedService.urlEpisodeDataBase+episode.StillPath;
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
      this.videoService.show(this.libraryService.CreateBuilderVideoFromItem(this.detail,this.mediaServer));
    }

    public onClickSeason(item:MediaSeason){
      this.detail.CurrentSeason=item;
    }

    public onClickEpisode(episode:MediaEpisode){
      this.getVideoByEpisode(episode);
    }

    public getVideoByEpisode(episode:MediaEpisode){
      this.videoService.show(this.libraryService.CreateBuilderVideoFromEpisode(this.detail,episode,this.mediaServer));
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
