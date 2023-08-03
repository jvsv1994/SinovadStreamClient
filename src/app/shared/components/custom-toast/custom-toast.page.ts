
import { CommonModule } from '@angular/common';
import { Component, Inject, inject} from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';

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

@Component({
  selector: 'app-custom-toast',
  templateUrl: './custom-toast.page.html',
  styleUrls: ['./custom-toast.page.scss'],
  standalone: true,
  imports: [MatSnackBarModule,CommonModule]
})
export class CustomToastPage{
  snackBarRef = inject(MatSnackBarRef);
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public toastOptions: ToastOptions) {

    }

    public toastType(): typeof ToastType {
      return ToastType;
    }

}
