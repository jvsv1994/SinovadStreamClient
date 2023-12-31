
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import { CustomMenuItem, CustomMenuConfiguration } from '../../services/custom-menu.service';

@Component({
  selector: 'app-custom-menu',
  templateUrl: './custom-menu.component.html',
  styleUrls: ['./custom-menu.component.scss']
})
export class CustomMenuComponent implements AfterViewInit{

  @Output() hide=new EventEmitter();
  @Output() selectOption=new EventEmitter();;
  @Input() options:CustomMenuConfiguration;
  @Input() right:number;
  @Input() top:number;
  showMenu:boolean=false;

  constructor(private ref: ChangeDetectorRef) {
    }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.showMenu=true;
      this.ref.detectChanges();
    }, 100);
  }

  public onClickOutside(){
    this.hide.emit(true);
  }

  public onSelectItem(item:CustomMenuItem){
    this.selectOption.emit(item);
  }

}
