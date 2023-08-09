
import { ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { HttpMethodType, MediaType } from 'src/app/shared/enums';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { ActivatedRoute, Router } from '@angular/router';

import { SinovadApiGenericResponse } from 'src/app/response/sinovadApiGenericResponse';
import { ItemDetail } from '../shared/item-detail.model';
import { Season } from 'src/app/seasons/shared/season.model';
import { Episode } from 'src/app/episodes/shared/episode.model';
import { VideoService } from '../video/service/video.service';

declare var window;
@Component({
  selector: 'app-media-detail',
  templateUrl: './media-detail.component.html',
  styleUrls: ['./media-detail.component.scss']
})
export class MediaDetailComponent implements OnInit {

  _window=window;
  detail:ItemDetail;
  listGenresByItem:any[];
  startResize:boolean=false;
  itemUserData:any;
  listEpisodePreference:any[];
  lastEpisodeWatched:any;

  constructor(
    private restProvider: RestProviderService,
    public activeRoute: ActivatedRoute,
    private router: Router,
    private videoService:VideoService,
    private  ref:ChangeDetectorRef,
    public sharedService: SharedService) {


    }

    ngOnInit(): void {
      let mediaType = this.activeRoute.snapshot.queryParams['mediaType'];
      let mediaId = this.activeRoute.snapshot.queryParams['mediaId'];
      if(mediaType && mediaId)
      {
        if(mediaType==MediaType.Movie)
        {
          this.getMovieDetail(mediaId);
        }else if(mediaType==MediaType.TvSerie)
        {
          this.getTvSerieDetail(mediaId);
        }else{
          this.router.navigate(['404'],{ skipLocationChange: false});
        }
      }else{
        this.router.navigate(['404'],{ skipLocationChange: false});
      }
    }

    public getMovieDetail(movieId:number){
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,"/videos/GetMovieDataByUser?userId="+this.sharedService.userData.Id+"&movieId="+movieId).then((response:SinovadApiGenericResponse) => {
        this.detail=response.Data;
      },error=>{
        console.error(error);
        this.router.navigate(['404'],{ skipLocationChange: false});
      });
    }

    public getTvSerieDetail(tvSerieId:number){
      var path="/videos/GetTvSerieDataByUser?userId="+this.sharedService.userData.Id+"&tvSerieId="+tvSerieId;
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        if(response.Data.ListSeasons && response.Data.ListSeasons.length>0)
        {
          response.Data.CurrentSeason=response.Data.ListSeasons[0];
        }
        this.detail=response.Data;
      },error=>{
        console.error(error);
      });
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
