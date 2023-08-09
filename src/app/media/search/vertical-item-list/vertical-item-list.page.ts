
import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { HttpMethodType, MediaType } from 'src/app/shared/enums';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { SinovadApiGenericResponse } from 'src/app/response/sinovadApiGenericResponse';
import { Item } from '../../shared/item.model';
import { ItemDetail } from '../../shared/item-detail.model';
import { Router } from '@angular/router';

declare var window;
@Component({
  selector: 'app-vertical-item-list',
  templateUrl: './vertical-item-list.page.html',
  styleUrls: ['./vertical-item-list.page.scss']
})
export class VerticalItemListPage implements OnInit {

  @ViewChild('itemListContainer') container: ElementRef;
  @Input() searchText:string;
  listItems:Item[]=[];
  listGroupItems:any[]=[];

  constructor(
    private router: Router,
    public restProvider: RestProviderService,
    public sharedService: SharedService) {


    }

    public ngOnInit(): void {
      this.getItemsBySearch();
    }

    public getItemsBySearch(){
      if(this.searchText.trim()!="")
      {
        var path='/videos/SearchTvPrograms?userId='+this.sharedService.userData.Id+"&searchMovies="+true+"&searchTvSeries="+true+"&searchText="+this.searchText;
        this.restProvider.executeSinovadApiService(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
          let listItems:Item[]=response.Data;
          this.listItems=listItems;
          this.buildGroupItems(this.listItems);
        },error=>{
          console.error(error);
        });
      }else{
        this.listItems=[];
        this.listGroupItems=[];
      }
    }

    public buildGroupItems(originalListItems:Item[]){
      if(originalListItems && originalListItems.length>0)
      {
        let referenceWidth=window.innerWidth>=2048?250:180;
        var numberOfObjects=Math.floor((this.container.nativeElement.offsetWidth/referenceWidth));
        var groupedProducts = originalListItems.reduce((acc, elem, index) => {
          var rowNum = Math.floor(index/numberOfObjects) + 1
          acc[`row${rowNum}`] = acc[`row${rowNum}`] || []
          acc[`row${rowNum}`].push(elem)
          return acc
        }, {})
        var resultArray = Object.keys(groupedProducts).map(function(personNamedIndex){
          let person = groupedProducts[personNamedIndex];
          // do something with person
          return person;
        });
        this.listGroupItems=resultArray;
      }else{
        this.listGroupItems=[];
      }
    }

    public onClickItem(item:Item){
      if(item.MovieId)
      {
        this.getMovieDetail(item);
      }else if(item.TvSerieId){
        this.getTvSerieDetail(item);
      }
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


    @HostListener('window:resize', ['$event'])
    onResize(event) {
      this.buildGroupItems(this.listItems);
    }
}
