import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export declare type EventHandler = (...args: any[]) => any;

export enum ToastType
{
  Success = 1,
  Error = 2,
  Info = 3
}

export class ToastOptions{
  containerId?:string;
  message:string;
  toastType:ToastType;
  displayTime?:number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {

  public toast$ = new Subject<ToastOptions>();
  constructor(
  ) {
  }

  public showToast(event:ToastOptions):void{
    this.toast$.next(event);
  };

  public getToastEvent():Observable<ToastOptions>{
    return this.toast$.asObservable();
  }

}
