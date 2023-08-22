export class DropDownMenuItem<T>{
  title?:string;
  subtitle?:string;
  text?:string;
  key?:string;
  showBorderBottom?:boolean;
  imageUrl?:string;
  iconClass?:string;
  isSelected?:boolean;
  path?:string;
  itemData:T;
}
