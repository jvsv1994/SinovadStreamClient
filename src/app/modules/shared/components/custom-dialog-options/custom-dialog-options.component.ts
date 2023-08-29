import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


export class DialogOption{
  text:string;
  key:string;
}

export class DialogOptionsConfiguration{
  title:string;
  message:string;
  actions:DialogOption[];
}

@Component({
  selector: 'app-custom-dialog-options',
  templateUrl: './custom-dialog-options.component.html',
  styleUrls:['./custom-dialog-options.component.scss']
})
export class CustomDialogOptionsComponent{

constructor(
    public dialog: MatDialogRef<CustomDialogOptionsComponent>,
    @Inject(MAT_DIALOG_DATA) public options: DialogOptionsConfiguration) { }

    public onClickDialogAction(action:DialogOption){
      this.dialog.close(action);
    }

}
