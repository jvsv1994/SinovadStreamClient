
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewContainerRef} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { Subscription } from 'rxjs';
import { ParentComponent } from '../parent/parent.component';
import { DropDownMenuItem } from './dropDownMenuItem';
import { DropDownMenuOptions } from './dropDownMenuOptions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-drop-down-menu-content',
  templateUrl: './drop-down-menu-content.page.html',
  styleUrls: ['./drop-down-menu-content.page.scss']
})
export class DropDownMenuContentPage extends ParentComponent implements OnInit,OnDestroy{

  @Output() hideContextMenu =new EventEmitter();
  @Output() clickItem =new EventEmitter();
  htmlContent:HTMLElement;
  mainContainer:HTMLElement;
  hideContextMenuSuscription:Subscription;
  clickOptionSubscription:Subscription;
  show:boolean=false;
  @Input() dropDownMenuOptions:DropDownMenuOptions;

  constructor(
    private router: Router,
    public ref:ChangeDetectorRef,
    public viewContainerRef: ViewContainerRef,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
      this.hideContextMenu.emit(true);
    }

    ngAfterViewInit(){
      this.showContent();
    }

    public async showContent(){
      await this.delay(100);
      this.show=true;
    }

    public onClickOutside(){
      this.hideContextMenu.emit(true);
    }

    public onClickDropDownMenuOption(option:DropDownMenuItem){
      this.clickItem.emit(option);
      this.router.navigateByUrl(option.path);
    }

}
