import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { MediaServer } from '../../../manage/modules/pages/servers/models/server.model';
import { SignalIRHubService } from 'src/app/services/signal-ir-hub.service';
import { LibraryService } from '../../../settings/modules/pages/server/modules/pages/manage/modules/pages/libraries/services/library.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { ItemsGroup } from '../../../media/models/items-group.model';
import { Item } from '../../../media/models/item.model';
import { MediaItemService } from '../../../media/services/media-item.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {

  itemsGroupList:ItemsGroup[]=[];
  _window=window;
  subscription:Subscription= new Subscription();
  mediaServers:MediaServer[];
  loadingConnection:boolean=true;

  constructor(
    private signalIrService:SignalIRHubService,
    private mediaItemService:MediaItemService,
    public router: Router,
    public commonService: CommonService,
    public sharedDataService: SharedDataService) {
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
      let ctx=this;
      this.subscription.add(this.signalIrService.isEnablingMediaServer().subscribe((mediaServerGuid:string)=>{
        var mediaServer=ctx.mediaServers.find(x=>x.Guid==mediaServerGuid);
        if(mediaServer && !mediaServer.isSecureConnection)
        {
          ctx.loadingConnection=false;
          mediaServer.isSecureConnection=true;
          ctx.getAllItemsByMediaServer(mediaServer);
        }
      }));
      this.subscription.add(this.signalIrService.isDisablingMediaServer().subscribe((mediaServerGuid:string)=>{
        var mediaServer=ctx.mediaServers.find(x=>x.Guid==mediaServerGuid);
        if(mediaServer && mediaServer.isSecureConnection)
        {
          mediaServer.isSecureConnection=false;
          ctx.clearItemsInGroup(mediaServer.Id);
        }
      }));
      this.subscription.add(this.signalIrService.isUpdatingLibrariesByMediaServer().subscribe((mediaServerGuid:string)=>{
        var mediaServer=ctx.mediaServers.find(x=>x.Guid==mediaServerGuid);
        if(mediaServer && !mediaServer.isSecureConnection)
        {
          mediaServer.isSecureConnection=true;
          ctx.getAllItemsByMediaServer(mediaServer);
        }
      }));
      this.subscription.add(this.signalIrService.isUpdatingItemsByMediaServer().subscribe((mediaServerGuid:string)=>{
          var mediaServer=ctx.mediaServers.find(x=>x.Guid==mediaServerGuid);
          if(mediaServer && !mediaServer.isSecureConnection)
          {
            mediaServer.isSecureConnection=true;
            ctx.getAllItemsByMediaServer(mediaServer);
          }
      }));
    }

    public ngOnInit(): void {
      this.mediaServers=JSON.parse(JSON.stringify(this.sharedDataService.mediaServers));
      if(this.isEnableAnyMediaServer())
      {
        this.loadingConnection=false;
      }else{
        setTimeout(() => {
          this.loadingConnection=false;
        }, 3000);
      }
      this.mediaServers.forEach(mediaServer => {
        if(mediaServer.isSecureConnection)
        {
          this.getAllItemsByMediaServer(mediaServer);
        }
      });
    }

    ngOnDestroy(){
      this.subscription.unsubscribe();
    }

    public isEnableAnyMediaServer(){
      if(this.mediaServers.filter(x=>x.isSecureConnection).length>0){
        return true;
      }else{
        return false;
      }
    }

    public considerAllMediaServers(){
      if(window.location.pathname.endsWith("home"))
      {
        return true;
      }else{
        return false;
      }
    }

    private getAllItemsByMediaServer(mediaServer:MediaServer){
      this.mediaItemService.getAllMediaItems(mediaServer.Url,this.sharedDataService.currentProfile.Id).then((itemsGroupList:ItemsGroup[])=>{
        this.setItemsInGroup(mediaServer.Id,itemsGroupList);
      },error=>{});
    }

    private setItemsInGroup(mediaServerId:number,itemsGroupList:ItemsGroup[]){
      if(itemsGroupList.length>0)
      {
        itemsGroupList.forEach(itemGroup => {
          var itemGroupFinded=this.itemsGroupList.find(x=>x.Name==itemGroup.Name);
          if(itemGroupFinded==undefined)
          {
            this.itemsGroupList.push(itemGroup);
          }else{
            var lisItemsFromOtherServers=itemGroupFinded.ListItems.filter(x=>x.MediaServerId!=mediaServerId);
            var newListItems=lisItemsFromOtherServers.concat(itemGroup.ListItems);
            var newListItemsOrdered=newListItems.sort((a: Item, b: Item) => {
              if (new Date(a.Created).getTime()>new Date(b.Created).getTime())    return -1;
              else if(new Date(b.Created).getTime()>new Date(a.Created).getTime())  return  1;
              else return  0;
            });
            itemGroupFinded.ListItems=newListItemsOrdered;
          }
        });
        this.itemsGroupList=this.itemsGroupList.sort((a: ItemsGroup, b: ItemsGroup) => {
          if (a.Id>b.Id) return 1;
          else if (a.Id<=b.Id)  return  -1;
          else return  0;
        });
      }
    }

    private clearItemsInGroup(mediaServerId:number){
      this.itemsGroupList.forEach(itemsGroup => {
        var newListitems= itemsGroup.ListItems.filter(x=>x.MediaServerId!=mediaServerId);
        itemsGroup.ListItems=newListitems.sort((a: Item, b: Item) => {
          if (new Date(a.Created).getTime()>new Date(b.Created).getTime())    return -1;
          else if(new Date(b.Created).getTime()>new Date(a.Created).getTime())  return  1;
          else return  0;
        });
      });
    }

}
