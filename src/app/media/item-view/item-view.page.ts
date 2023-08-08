
import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';

import { MediaType } from 'src/app/shared/enums';
import { Episode } from 'src/app/episodes/shared/episode.model';
import { ItemDetail } from '../shared/item-detail.model';
import { VideoService } from '../video/service/video.service';
import { Season } from 'src/app/seasons/shared/season.model';

declare var window;
@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.page.html',
  styleUrls: ['./item-view.page.scss']
})
export class ItemViewPage implements OnInit {

  _window=window;
  @Input() detail:ItemDetail;
  listGenresByItem:any[];
  startResize:boolean=false;
  @ViewChild('container') container: ElementRef;
  itemUserData:any;
  listEpisodePreference:any[];
  lastEpisodeWatched:any;

  constructor(
    private videoService:VideoService,
    private  ref:ChangeDetectorRef,
    public sharedService: SharedService) {


    }

    public getEpisodeImagePath(episode:any){
      if(this.detail.TmdbId!=undefined && this.detail.TmdbId!=0){
        if(episode.StillPath)
        {
          return this.sharedService.urlEpisodeDataBase+episode.StillPath;
        }else{
          return this.sharedService.getUrlByItemDetailMovieDataBase(this.detail);
        }
      }else{
        return episode.StillPath;
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

    ngOnInit(): void {

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
      if(this.detail.Item.MediaType==MediaType.Movie)
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
      this.videoService.show(this.sharedService.CreateBuilderVideoFromItem(this.detail.Item,this.detail));
    }

    public onClickSeason(item:Season){
      this.detail.CurrentSeason=item;
    }

    public onClickEpisode(episode:Episode){
      this.getVideoByEpisode(episode);
    }

    public getVideoByEpisode(episode:Episode){
      this.videoService.show(this.sharedService.CreateBuilderVideoFromEpisode(episode,this.detail));
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