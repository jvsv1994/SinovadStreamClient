import { DropDownMenuItem } from "./drop-down-menu-Item.model";


export class DropDownMenuOptions<T>{
  containerId?:string;
  target:HTMLElement;
  listItems?:DropDownMenuItem<T>[];
}
