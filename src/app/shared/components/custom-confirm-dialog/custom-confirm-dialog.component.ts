import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class ConfirmDialogOptions{
  title:string;
  message:string;
  accordMessage:string;
}
@Component({
  selector: 'app-custom-confirm-dialog',
  templateUrl: './custom-confirm-dialog.component.html',
  styleUrls:['./custom-confirm-dialog.component.scss']
})
export class CustomConfirmDialogComponent implements OnInit {

constructor(
    public dialog: MatDialogRef<CustomConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public options: ConfirmDialogOptions) { }

    closeDialog(): void {
      this.dialog.close(false);
    }
    confirmDialog(): void {
      this.dialog.close(true);
    }

  ngOnInit() {
  }

}
