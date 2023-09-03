
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import { Router } from '@angular/router';
import { DropDownMenuItem } from 'src/app/models/drop-down-menu-Item.model';
import { DropDownMenuOptions } from 'src/app/models/drop-down-menu-options.model';
import { CommonService } from 'src/app/services/common.service';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-drop-down-servers',
  templateUrl: './drop-down-servers.component.html',
  styleUrls: ['./drop-down-servers.component.scss']
})
export class DropDownServersComponent<T> implements AfterViewInit{

  @Output() hide =new EventEmitter();
  @Output() clickItem =new EventEmitter<DropDownMenuItem<T>>();
  show:boolean=false;
  @Input() dropDownMenuOptions:DropDownMenuOptions<T>;
  @Input() top:number;
  @Input() left:number;
  @Input() width:number;

  constructor(
    public commonService:CommonService,
    private ref: ChangeDetectorRef,
    private router: Router) {

    }

    ngAfterViewInit(){
      this.showContent();
    }

    public async showContent(){
      await this.commonService.delay(100);
      this.show=true;
      this.ref.detectChanges();
    }

    public onClickOutside(){
      this.hide.emit(true);
    }

    public onClickDropDownMenuOption(option:DropDownMenuItem<T>){
      this.clickItem.emit(option);
      this.router.navigateByUrl(option.path);
    }

}
