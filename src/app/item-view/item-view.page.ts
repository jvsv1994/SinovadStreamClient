
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { FormBuilder } from '@angular/forms';
import { HttpClient} from '@angular/common/http';
import { ItemType } from '../Enums';
import { RestProviderService } from 'src/services/rest-provider.service';
import { ItemDetail } from '../models/itemDetail';
import { Episode } from '../models/episode';
import { Season } from '../models/season';

declare var window;
@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.page.html',
  styleUrls: ['./item-view.page.scss']
})
export class ItemViewPage extends ParentComponent implements OnInit {

  _window=window;
  @Input() detail:ItemDetail;
  listGenresByItem:any[];
  startResize:boolean=false;
  @ViewChild('container') container: ElementRef;
  itemAccountData:any;
  listEpisodePreference:any[];
  lastEpisodeWatched:any;
  @Output() toggleVideo =new EventEmitter();

  constructor(
    public restProvider: RestProviderService,
    private  ref:ChangeDetectorRef,
    public http: HttpClient,
    private fb: FormBuilder,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

    public getEpisodeImagePath(episode:any){
      if(this.detail.TmdbId!=undefined && this.detail.TmdbId!=0){
        if(episode.StillPath)
        {
          return this.sharedData.urlEpisodeDataBase+episode.StillPath;
        }else{
          return this.getUrlByItemDetailMovieDataBase(this.detail);
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
        if(this.itemAccountData)
        {
          this.getVideosByItem(this.itemAccountData.CurrentTime);
        }
      }*/
    }

    public showVideo(){
      if(this.detail.Item.AccountStorageTypeId==ItemType.Movie)
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
      this.sharedData.currentVideo=this.CreateBuilderVideoFromItem(this.detail.Item,this.detail);
      this.toggleVideo.emit(true);
    }

    public onClickSeason(item:Season){
      this.detail.CurrentSeason=item;
    }

    public onClickEpisode(episode:Episode){
      this.getVideoByEpisode(episode);
    }

    public getVideoByEpisode(episode:Episode){
      this.sharedData.currentVideo=this.CreateBuilderVideoFromEpisode(episode,this.detail);
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
