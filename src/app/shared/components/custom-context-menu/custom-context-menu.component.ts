
import { Component, EventEmitter} from '@angular/core';
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

  constructor() {

    }

    public onClickOutside(){
      this.hideContextMenu.emit(true);
    }

    public onClickContextMenuOption(option:any){
      this.clickOption.emit(option);
    }

}
