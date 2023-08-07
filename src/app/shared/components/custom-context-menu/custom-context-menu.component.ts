
import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { Subscription } from 'rxjs';

export class ContextMenuOption{
  text:string;
  key?:string;
  showBorderBottom?:boolean;
  imageUrl?:string;
  iconClass?:string;
}

@Component({
  selector: 'app-custom-context-menu',
  templateUrl: './custom-context-menu.component.html',
  styleUrls: ['./custom-context-menu.component.scss']
})
export class CustomContextMenuComponent {

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
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {

    }

    public onClickOutside(){
      this.hideContextMenu.emit(true);
    }

    public onClickContextMenuOption(option:any){
      this.clickOption.emit(option);
    }

}
