
import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { Router } from '@angular/router';
import { LibraryService } from '../../../settings/modules/pages/server/modules/pages/manage/modules/pages/libraries/services/library.service';
import { CommonService } from 'src/app/services/common.service';
import { Item } from '../../../media/models/item.model';

declare var window;
@Component({
  selector: 'app-vertical-item-list',
  templateUrl: './vertical-item-list.component.html',
  styleUrls: ['./vertical-item-list.component.scss']
})
export class VerticalItemListComponent implements OnInit {

  @ViewChild('itemListContainer') container: ElementRef;
  @Input() searchText:string;
  listItems:Item[]=[];
  listGroupItems:any[]=[];

  constructor(
    private libraryService:LibraryService,
    private router: Router,
    public commonService: CommonService,
    public sharedDataService: SharedDataService) {


    }

    public ngOnInit(): void {
      this.getItemsBySearch();
    }

    public getItemsBySearch(){
      if(this.searchText.trim()!="")
      {
        this.sharedDataService.mediaServers.forEach(mediaServer => {
          if(mediaServer.isSecureConnection)
          {
            this.libraryService.getAllMediaItemsBySearchQuery(mediaServer.Url,this.searchText).then((listItems:Item[]) => {
              this.listItems=this.listItems.concat(listItems);
              this.buildGroupItems(this.listItems);
            },error=>{
              console.error(error);
            });
          }
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
      this.getMediaDetail(item);
    }

    public getMediaDetail(item:Item){
      var mediaServer=this.sharedDataService.mediaServers.find(x=>x.Id==item.MediaServerId);
      this.router.navigateByUrl('/media/server/'+mediaServer.Guid+"/libraries/"+item.LibraryId+"/detail?mediaType="+item.MediaTypeId+"&mediaId="+item.MediaItemId);
    }


    @HostListener('window:resize', ['$event'])
    onResize(event) {
      this.buildGroupItems(this.listItems);
    }
}
