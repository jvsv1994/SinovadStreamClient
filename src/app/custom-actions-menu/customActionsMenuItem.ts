import { EventEmitter } from "@angular/core";

export class CustomActionsMenuItem{
  title:string;
  eventOnSelectItem?:EventEmitter<boolean>;
}
