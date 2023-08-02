import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDeleteMessageBoxOptions } from './confirmDeleteMessageBoxOptions';

@Component({
  selector: 'app-custom-confirm-dialog',
  templateUrl: './custom-confirm-dialog.component.html',
  styleUrls:['./custom-confirm-dialog.component.scss']
})
export class CustomConfirmDialogComponent implements OnInit {

constructor(
    public dialog: MatDialogRef<CustomConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public options: ConfirmDeleteMessageBoxOptions) { }

    closeDialog(): void {
      this.dialog.close(false);
    }
    confirmDialog(): void {
      this.dialog.close(true);
    }

  ngOnInit() {
  }

}
