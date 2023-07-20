import { ToastType } from "./toastEnums";

export class ToastOptions{
  containerId?:string;
  message:string;
  toastType?:ToastType;
  displayTime?:number;
}
