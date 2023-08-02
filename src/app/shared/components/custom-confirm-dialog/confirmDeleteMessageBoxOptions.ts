import { EventEmitter } from "@angular/core";

export class ConfirmDeleteMessageBoxOptions{
  containerId?:string;
  title:string;
  message:string;
  accordMessage:string;
  confirmEvent?:EventEmitter<boolean>;
}
