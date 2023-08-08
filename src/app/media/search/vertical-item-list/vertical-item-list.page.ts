
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { HttpClient } from '@angular/common/http';
import { HttpMethodType } from 'src/app/shared/enums';
import {v4 as uuid} from "uuid";
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';

import { SinovadApiGenericResponse } from 'src/app/response/sinovadApiGenericResponse';
import { Item } from '../../shared/item.model';
import { ItemDetail } from '../../shared/item-detail.model';

declare var window;
@Component({
  selector: 'app-vertical-item-list',
  templateUrl: './vertical-item-list.page.html',
  styleUrls: ['./vertical-item-list.page.scss']
})
export class VerticalItemListPage implements OnInit {

  @ViewChild('itemListContainer') container: ElementRef;
  @Input() executeSearch:EventEmitter<string>;
  @Output() showItemView =new EventEmitter();
  listItems:Item[]=[];
  listGroupItems:any[]=[];
  lastCallGUID:string;

  constructor(
    public restProvider: RestProviderService,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {


    }

    public ngOnInit(): void {
      let ctx=this;
      this.executeSearch.subscribe(searchText => {
        let lastCallGUID=uuid();
        ctx.lastCallGUID=lastCallGUID;
        ctx.getItemsBySearch(searchText,lastCallGUID);
      });
    }

    public ngAfterViewInit(){

    }

    public getItemsBySearch(searchText:string,lastCallGUID:string){
      if(searchText.trim()!="")
      {
        var path='/videos/SearchTvPrograms?userId='+this.sharedData.userData.Id+"&searchMovies="+true+"&searchTvSeries="+true+"&searchText="+searchText;
        this.restProvider.executeSinovadApiService(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
          let listItems:Item[]=response.Data;
          if(lastCallGUID==this.lastCallGUID)
          {
            this.listItems=listItems;
            this.buildGroupItems(this.listItems);
          }
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
      this.showItemView.emit(data);
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


    @HostListener('window:resize', ['$event'])
    onResize(event) {
      this.buildGroupItems(this.listItems);
    }
}
