import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { CustomSnackBarComponent, SnackBarOptions, SnackBarType } from '../components/custom-snack-bar/custom-snack-bar.component';

export declare type EventHandler = (...args: any[]) => any;

@Injectable({ providedIn: 'root' })
export class SnackBarService {

  constructor(
    private snackBar: MatSnackBar) {
    }

  public showSnackBar(message:string,SnackBarType:SnackBarType){
    var config = new MatSnackBarConfig<SnackBarOptions>();
    config.duration=2000;
    config.data={
      message:message,snackBarType:SnackBarType
    }
    this.snackBar.openFromComponent(CustomSnackBarComponent,config);
  }


}
