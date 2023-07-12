
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient } from '@angular/common/http';
import { HttpMethodType, MediaType } from '../Enums';
import { RestProviderService } from 'src/services/rest-provider.service';
import { Item } from '../models/item';
import { ItemsGroup } from '../models/itemsGroup';
import { ItemDetail } from '../models/itemDetail';
import { SinovadApiGenericResponse } from '../response/sinovadApiGenericResponse';

declare var window;
@Component({
  selector: 'app-horizontal-item-list',
  templateUrl: './horizontal-item-list.page.html',
  styleUrls: ['./horizontal-item-list.page.scss']
})
export class HorizontalItemListPage extends ParentComponent implements OnInit {

  @Output() toggleVideo =new EventEmitter();
  @Output() showItemView =new EventEmitter();
  @Output() focus =new EventEmitter();
  showLoadingApp:boolean=true;
  @Input() currentMediaTypeID: number;
  @Input() title: string;
  listItems: any[];
  itemsGroupList:ItemsGroup[]=[];
  _window=window;

  constructor(
    public restProvider: RestProviderService,
    private  ref:ChangeDetectorRef,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

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

    public onSelectItem(currentItem:any){
      currentItem.scrollIntoView({block:'center'});
      this.ref.detectChanges();
    }

    public getAllProgramsByAccount(searchMovies:boolean,searchTvSeries:boolean){
      var path='/videos/GetAllTvProgramsOrganized?userId='+this.sharedData.userData.Id+"&profileId="+this.sharedData.currentProfile.Id+"&searchMovies="+searchMovies+"&searchTvSeries="+searchTvSeries;
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        var itemsGroupList:ItemsGroup[]=response.Data;
        this.itemsGroupList=itemsGroupList;
        this.ref.detectChanges();
        this.focus.emit();
      },error=>{
        console.error(error);
      });
    }

    public onClickItem(item: Item)
    {
      if(item.CurrentTime!=undefined && item.ContinueVideo)
      {
        this.continueVideoByItem(item);
      }else{
        if(item.MovieId)
        {
          this.getMovieDetail(item);
        }else if(item.TvSerieId){
          this.getTvSerieDetail(item);
        }
      }
    }

    public continueVideoByItem(item:Item){
      var path=item.TvSerieId?"/videos/GetTvSerieDetail?userId="+this.sharedData.userData.Id+"&tvSerieId="+item.TvSerieId:"/videos/GetMovieDetail?movieId="+item.MovieId
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        let detail:ItemDetail=response.Data;
        detail.Item=item;
        var builderVideo= this.CreateBuilderVideoFromItem(item,detail);
        this.sharedData.currentVideo=builderVideo;
        this.toggleVideo.emit(true);
        this.ref.detectChanges();
      },error=>{
        console.error(error);
      });
    }

    public getMovieDetail(item:Item){
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,"/videos/GetMovieDetail?movieId="+item.MovieId).then((response:SinovadApiGenericResponse) => {
        let data:ItemDetail=response.Data;
        data.Item=item;
        this.setDataAndShowItemView(data);
      },error=>{
        console.error(error);
      });
    }

    public getTvSerieDetail(item:Item){
      var path="/videos/GetTvSerieDetail?userId="+this.sharedData.userData.Id+"&tvSerieId="+item.TvSerieId;
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        let data:ItemDetail=response.Data;
        data.Item=item;
        this.setDataAndShowItemView(data);
      },error=>{
        console.error(error);
      });
    }

    public setDataAndShowItemView(data:ItemDetail){
      if(data.ListSeasons && data.ListSeasons.length>0)
      {
        data.CurrentSeason=data.ListSeasons[0];
      }
      this.showItemView.emit(data);
    }

    ngAfterViewInit(){
      if(this.sharedData.currentProfile)
      {
        if(this.currentMediaTypeID==MediaType.Movie)
        {
          this.getAllProgramsByAccount(true,false);
        }else if(this.currentMediaTypeID==MediaType.TvSerie)
        {
          this.getAllProgramsByAccount(false,true);
        }else{
          this.getAllProgramsByAccount(true,true);
        }
      }
    }

    public ngOnInit(): void {
    }

    public closeVideo(){
      this.sharedData.currentVideo=undefined;
      this.toggleVideo.emit(false);
      this.ref.detectChanges();
    }

}
