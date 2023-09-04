
import { Component, OnDestroy, OnInit} from '@angular/core';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SignalIRHubService } from 'src/app/services/signal-ir-hub.service';
import { Library } from '../../../settings/modules/pages/server/modules/pages/manage/modules/pages/libraries/models/library.model';
import { LibraryService } from '../../../settings/modules/pages/server/modules/pages/manage/modules/pages/libraries/services/library.service';
import { MediaServer } from '../../../manage/modules/pages/servers/models/server.model';
import { CommonService } from 'src/app/services/common.service';
import { ItemsGroup } from '../../models/items-group.model';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-library-items',
  templateUrl: './library-items.component.html',
  styleUrls: ['./library-items.component.scss']
})
export class LibraryItemsComponent implements OnInit,OnDestroy {

  itemsGroupList:ItemsGroup[]=[];
  _window=window;
  subscription:Subscription= new Subscription();;
  title:string;
  subtitle:string;
  currentLibrary:Library;
  currentMediaServer:MediaServer;
  loadingConnection:boolean=true;

  constructor(
    private signalIrService:SignalIRHubService,
    private libraryService:LibraryService,
    public activeRoute: ActivatedRoute,
    public router: Router,
    public commonService: CommonService,
    public sharedDataService: SharedDataService) {
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
      let ctx=this;
      this.subscription.add(this.signalIrService.isEnablingMediaServer().subscribe((mediaServerGuid:string)=>{
        if(ctx.currentMediaServer && ctx.currentMediaServer.Guid==mediaServerGuid && !ctx.currentMediaServer.isSecureConnection)
        {
          ctx.loadingConnection=false;
          ctx.currentMediaServer.isSecureConnection=true;
          ctx.getItemsByCurrentMediaServerAndCurrentLibrary();
        }
      }));
      this.subscription.add(this.signalIrService.isDisablingMediaServer().subscribe((mediaServerGuid:string)=>{
        if(ctx.currentMediaServer && ctx.currentMediaServer.Guid==mediaServerGuid && ctx.currentMediaServer.isSecureConnection)
        {
          ctx.currentMediaServer.isSecureConnection=false;
          ctx.clearItemsInGroup(ctx.currentMediaServer.Id);
        }
      }));
      this.subscription.add(this.signalIrService.isUpdatingLibrariesByMediaServer().subscribe((mediaServerGuid:string)=>{
        if(ctx.currentMediaServer && ctx.currentMediaServer.Guid==mediaServerGuid && !ctx.currentMediaServer.isSecureConnection)
        {
          ctx.currentMediaServer.isSecureConnection=true;
          ctx.getItemsByCurrentMediaServerAndCurrentLibrary();
        }
      }));
      this.subscription.add(this.signalIrService.isUpdatingItemsByMediaServer().subscribe((mediaServerGuid:string)=>{
        if(ctx.currentMediaServer && ctx.currentMediaServer.Guid==mediaServerGuid && !ctx.currentMediaServer.isSecureConnection)
        {
          ctx.currentMediaServer.isSecureConnection=true;
          ctx.getItemsByCurrentMediaServerAndCurrentLibrary();
        }
      }));
    }

    public ngOnInit(): void {
      var mediaServerGuid=this.activeRoute.snapshot.params.serverGuid;
      if(mediaServerGuid!=undefined)
      {
        var mediaServer=this.sharedDataService.mediaServers.find(x=>x.Guid==mediaServerGuid);
        if(mediaServer)
        {
          this.currentMediaServer=JSON.parse(JSON.stringify(mediaServer));
          if(this.currentMediaServer.isSecureConnection)
          {
            this.loadingConnection=false;
            this.getItemsByCurrentMediaServerAndCurrentLibrary();
          }else{
            setTimeout(() => {
              this.loadingConnection=false;
            }, 3000);
          }
        }else{
          this.router.navigateByUrl('/404')
        }
      }else{
        this.router.navigateByUrl('/404')
      }
    }

    ngOnDestroy(){
      this.subscription.unsubscribe();
    }

    private getItemsByCurrentMediaServerAndCurrentLibrary(){
      var libraryId=this.activeRoute.snapshot.params.libraryId;
      if(libraryId)
      {
        this.libraryService.getLibrariesByMediaServer(this.currentMediaServer.Url).then((list:Library[])=>{
          this.currentMediaServer.ListLibraries=list;
          var index=this.currentMediaServer.ListLibraries.findIndex(x=>x.Id==libraryId);
          if(index!=-1)
          {
            this.currentLibrary=this.currentMediaServer.ListLibraries[index];
            this.title=this.currentLibrary.Name;
            this.subtitle=this.currentMediaServer.FamilyName?this.currentMediaServer.FamilyName:this.currentMediaServer.DeviceName;
            this.libraryService.getMediaItemsByLibrary(this.currentMediaServer.Url,this.currentLibrary.Id,this.sharedDataService.currentProfile.Id).then((itemsGroupList:ItemsGroup[])=>{
              this.setItemsInGroup(this.currentMediaServer.Id,itemsGroupList);
            },error=>{
              console.error(error);
            });
          }
        });
      }else{
        this.router.navigateByUrl('/404')
      }
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
