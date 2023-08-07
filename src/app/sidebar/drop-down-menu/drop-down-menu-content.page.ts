
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import { Router } from '@angular/router';
import { DropDownMenuItem } from '../shared/drop-down-menu-Item.model';
import { DropDownMenuOptions } from '../shared/drop-down-menu-options.model';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';

@Component({
  selector: 'app-drop-down-menu-content',
  templateUrl: './drop-down-menu-content.page.html',
  styleUrls: ['./drop-down-menu-content.page.scss']
})
export class DropDownMenuContentPage implements AfterViewInit{

  @Output() hide =new EventEmitter();
  @Output() clickItem =new EventEmitter();
  show:boolean=false;
  @Input() dropDownMenuOptions:DropDownMenuOptions;
  @Input() top:number;
  @Input() left:number;
  @Input() width:number;

  constructor(
    private ref: ChangeDetectorRef,
    private sharedService:SharedDataService,
    private router: Router) {

    }

    ngAfterViewInit(){
      this.showContent();
    }

    public async showContent(){
      await this.sharedService.delay(100);
      this.show=true;
      this.ref.detectChanges();
    }

    public onClickOutside(){
      this.hide.emit(true);
    }

    public onClickDropDownMenuOption(option:DropDownMenuItem){
      this.clickItem.emit(option);
      this.router.navigateByUrl(option.path);
    }

}
