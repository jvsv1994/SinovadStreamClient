import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { CustomToastPage, ToastOptions, ToastType } from '../components/custom-toast/custom-toast.page';

export declare type EventHandler = (...args: any[]) => any;

@Injectable({ providedIn: 'root' })
export class SnackBarService {

  constructor(
    private snackBar: MatSnackBar) {
    }

  public showSnackBar(message:string,toastType:ToastType){
    var config = new MatSnackBarConfig<ToastOptions>();
    config.duration=2000;
    config.data={
      message:message,toastType:toastType
    }
    this.snackBar.openFromComponent(CustomToastPage,config);
  }


}
