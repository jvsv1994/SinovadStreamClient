
import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-media-server',
  templateUrl: './media-items.component.html',
  styleUrls: ['./media-items.component.scss']
})
export class MediaItemsComponent extends MediaGeneric implements OnInit {

  showLoadingApp:boolean=true;
  listItems: any[];
  itemsGroupList:ItemsGroup[]=[];
  _window=window;

  constructor(
    public activeRoute: ActivatedRoute,
    private router: Router,
    private videoService:VideoService,
    public restProvider: RestProviderService,
    private  ref:ChangeDetectorRef,
    public sharedService: SharedService) {
      super(activeRoute,sharedService);
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
    }

    public ngOnInit(): void {
      this.initializeHeaderData();
    }

    ngAfterViewInit(){
      if(this.sharedService.currentProfile)
      {
        if(this.currentMediaTypeID==MediaType.Movie)
        {
          this.getAllProgramsByUser(true,false);
        }else if(this.currentMediaTypeID==MediaType.TvSerie)
        {
          this.getAllProgramsByUser(false,true);
        }else{
          this.getAllProgramsByUser(true,true);
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

    public onSelectItem(currentItem:any){
      currentItem.scrollIntoView({block:'center'});
      this.ref.detectChanges();
    }

    public getAllProgramsByUser(searchMovies:boolean,searchTvSeries:boolean){
      var path='/videos/GetAllTvProgramsOrganized?userId='+this.sharedService.userData.Id+"&profileId="+this.sharedService.currentProfile.Id+"&searchMovies="+searchMovies+"&searchTvSeries="+searchTvSeries;
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        var itemsGroupList:ItemsGroup[]=response.Data;
        this.itemsGroupList=itemsGroupList;
        this.ref.detectChanges();
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
      var path=item.TvSerieId?"/videos/GetTvSerieDetail?userId="+this.sharedService.userData.Id+"&tvSerieId="+item.TvSerieId:"/videos/GetMovieDetail?movieId="+item.MovieId
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        let detail:ItemDetail=response.Data;
        detail.Item=item;
        var builderVideo= this.sharedService.CreateBuilderVideoFromItem(item,detail);
        this.videoService.show(builderVideo);
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
      var path="/videos/GetTvSerieDetail?userId="+this.sharedService.userData.Id+"&tvSerieId="+item.TvSerieId;
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
      if(data.Item.MovieId)
      {
        this.router.navigateByUrl('/media/server/'+data.Item.MediaServerGuid+"/libraries/"+data.Item.LibraryId+"/detail?mediaType="+MediaType.Movie+"&mediaId="+data.Item.MovieId);
      }else if(data.Item.TvSerieId)
      {
        this.router.navigateByUrl('/media/server/'+data.Item.MediaServerGuid+"/libraries/"+data.Item.LibraryId+"/detail?mediaType="+MediaType.TvSerie+"&mediaId="+data.Item.TvSerieId);
      }
    }

}
