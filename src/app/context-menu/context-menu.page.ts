
import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { Subscription } from 'rxjs';

export class ContextMenuOption{
  icon:string;
  text:string;
  key?:string;
  showBorderBottom?:boolean;
  eventOnSelectOption?:EventEmitter<boolean>;
}

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.page.html',
  styleUrls: ['./context-menu.page.scss']
})
export class ContextMenuPage implements OnInit,OnDestroy {

  @ViewChild('contextMenuTarget', { read: TemplateRef }) contextMenuTarget:TemplateRef<any>;

  left:number;
  top:number;
  listOptions:ContextMenuOption[];
  hideContextMenu =new EventEmitter();
  clickOption =new EventEmitter();
  htmlContent:HTMLElement;
  mainContainer:HTMLElement;
  hideContextMenuSuscription:Subscription;
  clickOptionSubscription:Subscription;

  constructor(
    public ref:ChangeDetectorRef,
    public viewContainerRef: ViewContainerRef,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {

    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
      this.hideContextMenu.emit(true);
    }

    ngAfterViewInit(){

    }

    public onClickOutside(){
      this.hideContextMenu.emit(true);
    }

    public onClickContextMenuOption(option:any){
      this.clickOption.emit(option);
    }

    public show(left:number,top:number,listOptions:ContextMenuOption[]):Promise<any>{
      return new Promise((resolve, reject) => {
        if(this.mainContainer==undefined)
        {
          this.mainContainer=document.getElementById("sinovadMainContainer");
        }
        this.left=left;
        this.top=top;
        this.listOptions=listOptions;
        if(this.mainContainer.contains(this.htmlContent))
        {
          this.hideContextMenu.emit(true);
        }
        setTimeout(() => {
          var embeddedViewRef = this.viewContainerRef.createEmbeddedView(this.contextMenuTarget);
          this.htmlContent=embeddedViewRef.rootNodes[0] as HTMLElement;
          this.mainContainer.appendChild(this.htmlContent);
          if(this.hideContextMenuSuscription!=undefined)
          {
            this.hideContextMenuSuscription.unsubscribe();
          }
          if(this.clickOptionSubscription!=undefined)
          {
            this.clickOptionSubscription.unsubscribe();
          }
          this.hideContextMenuSuscription=this.hideContextMenu.subscribe(event => {
            if(this.mainContainer.contains(this.htmlContent))
            {
              this.mainContainer.removeChild(this.htmlContent);
            }
          });
          this.clickOptionSubscription=this.clickOption.subscribe(event => {
            if(this.mainContainer.contains(this.htmlContent))
            {
              this.mainContainer.removeChild(this.htmlContent);
            }
            resolve(event);
          });
        }, 50);


      });
    }

}
