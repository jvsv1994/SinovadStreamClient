
import { CommonModule } from '@angular/common';
import { Component, Inject, inject} from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';

export enum SnackBarType
{
  Success = 1,
  Error = 2,
  Info = 3
}

export class SnackBarOptions{
  containerId?:string;
  message:string;
  snackBarType:SnackBarType;
  displayTime?:number;
}

@Component({
  selector: 'app-custom-snack-bar',
  templateUrl: './custom-snack-bar.component.html',
  styleUrls: ['./custom-snack-bar.component.scss'],
  standalone: true,
  imports: [MatSnackBarModule,CommonModule]
})
export class CustomSnackBarComponent{
  snackBarRef = inject(MatSnackBarRef);
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public toastOptions: SnackBarOptions) {

    }

    public SnackBarType(): typeof SnackBarType {
      return SnackBarType;
    }

}
