import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from 'src/app/modules/pages/media-items/models/item.model';
import { ItemsGroup } from 'src/app/modules/pages/media-items/models/items-group.model';
import { CommonService } from 'src/app/services/common.service';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-media-items',
  templateUrl: './media-items.component.html',
  styleUrls: ['./media-items.component.scss']
})
export class MediaItemsComponent {

  @Input() itemsGroupList:ItemsGroup[]=[];

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    private  ref:ChangeDetectorRef,
    public commonService: CommonService,
    public sharedDataService: SharedDataService) {
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
    if(item.ContinueVideo)
    {
      this.continueVideoByItem(item);
    }else{
      this.getMediaItemDetail(item);
    }
  }

  public getMediaItemDetail(item:Item){
    var mediaServer=this.sharedDataService.mediaServers.find(x=>x.Id==item.MediaServerId);
    this.router.navigateByUrl('/media/server/'+mediaServer.Guid+"/libraries/"+item.LibraryId+"/detail?mediaType="+item.MediaTypeId+"&mediaId="+item.MediaItemId);
  }

  public continueVideoByItem(item:Item){
    var mediaServer=this.sharedDataService.mediaServers.find(x=>x.Id==item.MediaServerId);
    this.router.navigateByUrl('/media/server/'+mediaServer.Guid+"/video/"+item.FileId);
  }
}
