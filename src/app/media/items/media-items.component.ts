
import { ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaType } from 'src/app/shared/enums';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { LibraryService } from 'src/app/libraries/shared/library.service';
import { Subscription } from 'rxjs';
import { ItemsGroup } from '../shared/models/items-group.model';
import { Item } from '../shared/models/item.model';
import { SignalIRHubService } from '../shared/services/signal-ir-hub.service';
import { MediaServer } from 'src/app/servers/shared/server.model';
import { Library } from 'src/app/libraries/shared/library.model';

@Component({
  selector: 'app-media-items',
  templateUrl: './media-items.component.html',
  styleUrls: ['./media-items.component.scss']
})
export class MediaItemsComponent implements OnInit,OnDestroy {

  itemsGroupList:ItemsGroup[]=[];
  _window=window;
  subscriptionEnableMediaServer:Subscription;
  subscriptionDisableMediaServer:Subscription;
  subscriptionUpdateLibrariesByMediaServer:Subscription;
  subscriptionUpdateItemsByMediaServer:Subscription;
  title:string;
  subtitle:string;
  currentLibrary:Library;
  currentMediaServer:MediaServer;
  mediaServers:MediaServer[];
  loadingConnection:boolean=true;

  constructor(
    private signalIrService:SignalIRHubService,
    private libraryService:LibraryService,
    public activeRoute: ActivatedRoute,
    public router: Router,
    public restProvider: RestProviderService,
    private  ref:ChangeDetectorRef,
    public sharedService: SharedService) {
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
      let ctx=this;
      this.subscriptionEnableMediaServer=this.signalIrService.isEnablingMediaServer().subscribe((mediaServerGuid:string)=>{
        if(ctx.considerAllMediaServers())
        {
          var mediaServer=ctx.mediaServers.find(x=>x.Guid==mediaServerGuid);
          if(mediaServer && !mediaServer.isSecureConnection)
          {
            ctx.loadingConnection=false;
            mediaServer.isSecureConnection=true;
            ctx.getItemsByMediaServer(mediaServer);
          }
        }else{
          if(ctx.currentMediaServer && ctx.currentMediaServer.Guid==mediaServerGuid && !ctx.currentMediaServer.isSecureConnection)
          {
            ctx.loadingConnection=false;
            ctx.currentMediaServer.isSecureConnection=true;
            ctx.getItemsByCurrentMediaServerAndCurrentLibrary();
          }
        }
      });
      this.subscriptionDisableMediaServer=this.signalIrService.isDisablingMediaServer().subscribe((mediaServerGuid:string)=>{
        if(ctx.considerAllMediaServers())
        {
          var mediaServer=ctx.mediaServers.find(x=>x.Guid==mediaServerGuid);
          if(mediaServer && mediaServer.isSecureConnection)
          {
            mediaServer.isSecureConnection=false;
            ctx.clearItemsInGroup(mediaServer.Id);
          }
        }else{
          if(ctx.currentMediaServer && ctx.currentMediaServer.Guid==mediaServerGuid && ctx.currentMediaServer.isSecureConnection)
          {
            ctx.currentMediaServer.isSecureConnection=false;
            ctx.clearItemsInGroup(ctx.currentMediaServer.Id);
          }
        }
      });
      this.subscriptionUpdateLibrariesByMediaServer=this.signalIrService.isUpdatingLibrariesByMediaServer().subscribe((mediaServerGuid:string)=>{
        if(ctx.considerAllMediaServers())
        {
          var mediaServer=ctx.mediaServers.find(x=>x.Guid==mediaServerGuid);
          if(mediaServer && !mediaServer.isSecureConnection)
          {
            mediaServer.isSecureConnection=true;
            ctx.getItemsByMediaServer(mediaServer);
          }
        }else{
          if(ctx.currentMediaServer && ctx.currentMediaServer.Guid==mediaServerGuid && !ctx.currentMediaServer.isSecureConnection)
          {
            ctx.currentMediaServer.isSecureConnection=true;
            ctx.getItemsByCurrentMediaServerAndCurrentLibrary();
          }
        }
      });
      this.subscriptionUpdateItemsByMediaServer=this.signalIrService.isUpdatingItemsByMediaServer().subscribe((mediaServerGuid:string)=>{
        if(ctx.considerAllMediaServers())
        {
          var mediaServer=ctx.mediaServers.find(x=>x.Guid==mediaServerGuid);
          if(mediaServer && !mediaServer.isSecureConnection)
          {
            mediaServer.isSecureConnection=true;
            ctx.getItemsByMediaServer(mediaServer);
          }
        }else{
          if(ctx.currentMediaServer && ctx.currentMediaServer.Guid==mediaServerGuid && !ctx.currentMediaServer.isSecureConnection)
          {
            ctx.currentMediaServer.isSecureConnection=true;
            ctx.getItemsByCurrentMediaServerAndCurrentLibrary();
          }
        }
      });
    }

    public ngOnInit(): void {
      if(this.considerAllMediaServers()){
        this.mediaServers=JSON.parse(JSON.stringify(this.sharedService.mediaServers));
        if(this.isEnableAnyMediaServer())
        {
          this.loadingConnection=false;
        }else{
          setTimeout(() => {
            this.loadingConnection=false;
          }, 3000);
        }
        if(window.location.pathname.endsWith("movies")){
          this.title="Películas";
        }
        if(window.location.pathname.endsWith("tvseries")){
          this.title="Series de TV"
        }
        this.mediaServers.forEach(mediaServer => {
          if(mediaServer.isSecureConnection)
          {
            this.getItemsByMediaServer(mediaServer);
          }
        });
      }else{
        var mediaServerGuid=this.activeRoute.snapshot.params.serverGuid;
        if(mediaServerGuid!=undefined)
        {
          var mediaServer=this.sharedService.mediaServers.find(x=>x.Guid==mediaServerGuid);
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
    }

    ngOnDestroy(){
      this.subscriptionEnableMediaServer.unsubscribe();
      this.subscriptionDisableMediaServer.unsubscribe();
      this.subscriptionUpdateLibrariesByMediaServer.unsubscribe();
      this.subscriptionUpdateItemsByMediaServer.unsubscribe();
    }

    public isEnableAnyMediaServer(){
      if(this.mediaServers.filter(x=>x.isSecureConnection).length>0){
        return true;
      }else{
        return false;
      }
    }

    public considerAllMediaServers(){
      if(window.location.pathname.endsWith("home") || window.location.pathname.endsWith("movies") || window.location.pathname.endsWith("tvseries"))
      {
        return true;
      }else{
        return false;
      }
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
            this.libraryService.getMediaItemsByLibrary(this.currentMediaServer.Url,this.currentLibrary.Id,this.sharedService.currentProfile.Id).then((itemsGroupList:ItemsGroup[])=>{
              this.setItemsInGroup(this.currentMediaServer.Id,itemsGroupList);
            },error=>{
              console.error(error);
            });
          }
        });
      }else{
        this.title=this.currentMediaServer.FamilyName?this.currentMediaServer.FamilyName:this.currentMediaServer.DeviceName;
        this.libraryService.getAllMediaItems(this.currentMediaServer.Url,this.sharedService.currentProfile.Id).then((itemsGroupList:ItemsGroup[])=>{
          this.setItemsInGroup(this.currentMediaServer.Id,itemsGroupList);
        },error=>{
          console.error(error);
        });
      }
    }


    private getItemsByMediaServer(mediaServer:MediaServer){
      if(window.location.pathname.endsWith("home"))
      {
        this.libraryService.getAllMediaItems(mediaServer.Url,this.sharedService.currentProfile.Id).then((itemsGroupList:ItemsGroup[])=>{
          this.setItemsInGroup(mediaServer.Id,itemsGroupList);
        },error=>{});
      }else if(window.location.pathname.endsWith("movies")){
        this.libraryService.getMediaItemsByMediaType(mediaServer.Url,MediaType.Movie,this.sharedService.currentProfile.Id).then((itemsGroupList:ItemsGroup[])=>{
          this.setItemsInGroup(mediaServer.Id,itemsGroupList);
        },error=>{
          console.error(error);
        });
      }else if(window.location.pathname.endsWith("tvseries")){
        this.libraryService.getMediaItemsByMediaType(mediaServer.Url,MediaType.TvSerie,this.sharedService.currentProfile.Id).then((itemsGroupList:ItemsGroup[])=>{
          this.setItemsInGroup(mediaServer.Id,itemsGroupList);
        },error=>{
          console.error(error);
        });
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

    public onClickItem(item: Item)
    {
      if(item.CurrentTime!=undefined && item.CurrentTime>0)
      {
        this.continueVideoByItem(item);
      }else{
        this.getMediaItemDetail(item);
      }
    }

    public getMediaItemDetail(item:Item){
      var mediaServer=this.sharedService.mediaServers.find(x=>x.Id==item.MediaServerId);
      this.router.navigateByUrl('/media/server/'+mediaServer.Guid+"/libraries/"+item.LibraryId+"/detail?mediaType="+item.MediaTypeId+"&mediaId="+item.MediaItemId);
    }

    public continueVideoByItem(item:Item){
      var mediaServer=this.sharedService.mediaServers.find(x=>x.Id==item.MediaServerId);
      this.router.navigateByUrl('/media/server/'+mediaServer.Guid+"/video/"+item.FileId);
    }

}
