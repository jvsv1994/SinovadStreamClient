
import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { Item } from '../../shared/item.model';
import { Router } from '@angular/router';
import { LibraryService } from 'src/app/libraries/shared/library.service';

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
    private libraryService:LibraryService,
    private router: Router,
    public sharedService: SharedService) {


    }

    public ngOnInit(): void {
      this.getItemsBySearch();
    }

    public getItemsBySearch(){
      if(this.searchText.trim()!="")
      {
        this.sharedService.mediaServers.forEach(mediaServer => {
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
      var mediaServer=this.sharedService.mediaServers.find(x=>x.Id==item.MediaServerId);
      this.router.navigateByUrl('/media/server/'+mediaServer.Guid+"/libraries/"+item.LibraryId+"/detail?mediaType="+item.MediaTypeId+"&mediaId="+item.MediaItemId);
    }


    @HostListener('window:resize', ['$event'])
    onResize(event) {
      this.buildGroupItems(this.listItems);
    }
}
