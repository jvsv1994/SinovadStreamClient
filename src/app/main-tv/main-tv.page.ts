
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { ItemDetail } from '../models/itemDetail';
import { ItemViewPage } from '../item-view/item-view.page';
import { HorizontalItemListPage } from '../horizontal-item-list/horizontal-item-list.page';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpMethodType, ItemType } from '../Enums';
import { SearchViewTvPage } from '../search-view-tv/search-view-tv.page';

@Component({
  selector: 'app-main-tv',
  templateUrl: './main-tv.page.html',
  styleUrls: ['./main-tv.page.scss']
})
export class MainTvPage extends ParentComponent implements OnInit {

  @Output() fullScreen= new EventEmitter();
  @Output() toggleVideo= new EventEmitter();
  showVideoPopUp:boolean=false;
  showSplashScreen:boolean=true;
  itemViewData:ItemDetail;
  hideContent:boolean=false;
  _window=window;
  currentItemTypeID:number;
  title:string;
  selectedMenuOption:any;
  customKeyboardEventVerticalContainer:any;
  customKeyboardEventVerticalHorizontalContainer:any;
  @ViewChild('menuContainer') menuContainer: ElementRef;
  @ViewChild('principalContainer') principalContainer: ElementRef;

  constructor(
    public restProvider: RestProviderService,
    private route:ActivatedRoute,
    private router: Router,
    public  ref:ChangeDetectorRef,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

    public showVideoInFullScreen(){
      this.fullScreen.emit(true);
    }


    public ngOnInit(): void {
      this.sharedData.currentToken=localStorage.getItem('apiKey');
      this.getAccount().then(res=>{

      },error=>{
        console.error(error);
      });
    }

    ngAfterViewInit(){
      let ctx=this;
      this.customKeyboardEventVerticalContainer=function onCustomKeyboardDown(event:any) {
        ctx.setKeyboardActionsInButtonsVerticalContainer(event);
      }
      this.customKeyboardEventVerticalHorizontalContainer=function onCustomKeyboardDown(event:any) {
        ctx.setKeyboardActionsSectionVerticalButtonsHorizontal(event,ctx.principalContainer,ctx.menuContainer,ctx.ref);
      }
      this.menuContainer.nativeElement.addEventListener('keydown',this.customKeyboardEventVerticalContainer);
      this.principalContainer.nativeElement.addEventListener('keydown',this.customKeyboardEventVerticalHorizontalContainer);
    }

    public logOut(){
      if(this.sharedData.configurationData.currentHost!=null)
      {
        this.restProvider.executeSinovadStreamServerService(HttpMethodType.DELETE,'/main/DeleteHostData').then((response) => {

        },error=>{
          console.error(error);
        });
      }
      this.sharedData.currentAccountServerData=undefined;
      this.sharedData.currentProfile=undefined;
      this.sharedData.accountData=undefined;
      this.sharedData.currentToken=undefined;
      localStorage.removeItem("apiKey");
      this.router.navigate([{ outlets: { rostp: ['logintv'] } }],{ skipLocationChange: false});
    }

    public onClickHeader(headerContainer:any){
     /*  if(!this.sharedData.showProfilesView)
      {
        this.focusContainer(headerContainer,this.ref);
      } */
    }

    public onClickBody(){
      this.focusContainer(this.principalContainer.nativeElement,this.ref);
    }

    public toogleMenu(){
      this.ref.detectChanges();
    }

    public setKeyboardActionsInButtonsVerticalContainer(event:any){
      var keycode = event.keyCode;
      let listElements=Array.from<any>(this.menuContainer.nativeElement.getElementsByTagName("button"));
      let numberElements=listElements.length;
      let index=listElements.findIndex(item=>item.id==this.sharedData.currentSelectedElement.id);
      if(keycode==39)//right
      {
        let listSections=Array.from<any>(this.principalContainer.nativeElement.querySelectorAll("section"));
        let section=listSections[0];
        this.sharedData.currentActiveSection=section
        let listElements=Array.from<any>(section.querySelectorAll("button"));
        let element=listElements[0];
        this.sharedData.currentSelectedElement=element;
        element.focus();
      }
      if(keycode==37)//left
      {

      }
      if(keycode==40)//down
      {
        let newIndex=index+1;
        if(newIndex<numberElements)
        {
          let element=listElements[newIndex];
          element.focus();
          this.sharedData.currentSelectedElement=element;
          this.ref.detectChanges();
        }else{

        }
      }
      if(keycode==38)//up
      {
        let newIndex=index-1;
        if(newIndex>=0)
        {
          let element=listElements[newIndex];
          element.focus();
          this.sharedData.currentSelectedElement=element;
          this.ref.detectChanges();
        }else{
          let listHeaders=Array.from<any>(document.getElementsByTagName("header"));
          if(listHeaders && listHeaders.length>0)
          {
            let header=listHeaders[0];
            let listElements=Array.from<any>(header.querySelectorAll("input, button"));
            if(listElements && listElements.length>0)
            {
              this.sharedData.currentActiveSection=header;
              let element=listElements[0];
              this.sharedData.currentSelectedElement=element;
              element.focus();
            }
          }
        }
      }
    }

    public onClickMenuOption(option:any){
      this.selectedMenuOption=option;
      this[option.method]();
    }

    public refresh(){
      if(this.selectedMenuOption)
      {
        this[this.selectedMenuOption.method]();
      }
      this.ref.detectChanges();
    }

    public ShowSeries(){
      this.itemViewData=undefined;
      this.title="Series de TV";
      this.currentItemTypeID=ItemType.TvSerie;
      this.showHorizontalItemList();
    }

    public ShowMovies(){
      this.itemViewData=undefined;
      this.title="Películas";
      this.currentItemTypeID=ItemType.Movie;
      this.showHorizontalItemList();
    }

    public ShowSearch(){
      this.itemViewData=undefined;
      this.title=undefined;
      this.currentItemTypeID=undefined;
      this.showVerticalItemList();
    }

    public ShowInitial(){
      this.title=undefined;
      this.itemViewData=undefined;
      this.currentItemTypeID=undefined;
      this.showHorizontalItemList();
    }

    public closeVideo(){
      this.sharedData.currentVideo=undefined;
      this.showHorizontalItemList();
      this.toggleVideo.emit(false);
    }

    public showHorizontalItemList(){
      this.hideContent=true;
      this.ref.detectChanges();
      this.hideContent=false;
      this.ref.detectChanges();
      this.router.navigate([{ outlets: { rohtp: ['hilp'] } }],{ relativeTo: this.route, skipLocationChange: true});
    }

    public showVerticalItemList(){
      this.hideContent=true;
      this.ref.detectChanges();
      this.hideContent=false;
      this.router.navigate([{ outlets: { rohtp: ['svtp'] } }],{ relativeTo: this.route, skipLocationChange: true});
    }

    public showItemView(){
      this.hideContent=true;
      this.ref.detectChanges();
      this.hideContent=false;
      this.router.navigate([{ outlets: { rohtp: ['ivp'] } }],{ relativeTo: this.route, skipLocationChange: true});
    }

    public onActivate(event:any){
      let ctx=this;
      if(event instanceof HorizontalItemListPage)
      {
        event.currentItemTypeID=this.currentItemTypeID;
        event.title=this.title;
        event.toggleVideo.subscribe(event => {
          ctx.toggleVideo.emit(event);
        });
        event.focus.subscribe(event => {
          this.focusInElementInContainer(ctx.principalContainer.nativeElement,ctx.ref);
        });
        event.showItemView.subscribe(event => {
          ctx.itemViewData=event;
          ctx.showItemView();
        });
      }
      if(event instanceof SearchViewTvPage)
      {
        event.showItemView.subscribe(event => {
          ctx.itemViewData=event;
          ctx.showItemView();
        });
      }
      if(event instanceof ItemViewPage)
      {
        event.detail=ctx.itemViewData;
        event.toggleVideo.subscribe(event => {
          ctx.toggleVideo.emit(event);
        });
        ctx.ref.detectChanges();
        ctx.focusInElementInContainer(this.principalContainer.nativeElement,this.ref);
      }
    }

}
