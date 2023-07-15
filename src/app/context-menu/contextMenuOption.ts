
import { EventEmitter} from '@angular/core';

export class ContextMenuOption{
  text:string;
  key?:string;
  showBorderBottom?:boolean;
  imageUrl?:string;
  iconClass?:string;
  eventOnSelectOption?:EventEmitter<boolean>;
}
