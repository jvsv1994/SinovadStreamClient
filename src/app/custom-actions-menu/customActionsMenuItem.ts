import { EventEmitter } from "@angular/core";

export class CustomActionsMenuItem{
  title:string;
  iconClass?:string;
  eventOnSelectItem?:EventEmitter<boolean>;
}
