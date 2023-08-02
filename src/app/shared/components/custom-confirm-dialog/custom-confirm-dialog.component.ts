import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-custom-confirm-dialog',
  templateUrl: './custom-confirm-dialog.component.html'
})
export class CustomConfirmDialogComponent implements OnInit {

constructor(
    public dialog: MatDialogRef<CustomConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public mensaje: string) { }

    closeDialog(): void {
      this.dialog.close(false);
    }
    confirmDialog(): void {
      this.dialog.close(true);
    }

  ngOnInit() {
  }

}
