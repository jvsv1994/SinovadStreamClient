
import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { Subscription } from 'rxjs';
import { ContextMenuOption } from './contextMenuOption';

@Component({
  selector: 'app-context-menu-content',
  templateUrl: './context-menu-content.page.html',
  styleUrls: ['./context-menu-content.page.scss']
})
export class ContextMenuContentPage implements OnInit,OnDestroy {

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

}
