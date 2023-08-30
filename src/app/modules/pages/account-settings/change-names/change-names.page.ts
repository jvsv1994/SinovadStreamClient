
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SharedService } from 'src/app/modules/shared/services/shared-data.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AccountSettingsService } from '../shared/services/account-settings.service';
import { ChangeNamesModel } from '../shared/models/change-names.model';

declare var window;
@Component({
  selector: 'app-change-names',
  templateUrl: './change-names.page.html',
  styleUrls: ['./change-names.page.scss','../shared/styles/account-settings-section.scss']
})
export class ChangeNamesPage implements OnInit {

  serverErrorMessage:string=undefined;
  changeNamesData:ChangeNamesModel;
  @Output() closeChangeNames=new EventEmitter();
  changeNamesForm = this.formBuilder.group({
    firstName: new FormControl(this.sharedService.userData.FirstName, [Validators.required]),
    lastName: new FormControl(this.sharedService.userData.LastName, [Validators.required])
  });
  loading:boolean=false;

  constructor(
    private accountSettingsService:AccountSettingsService,
    private formBuilder: FormBuilder,
    public sharedService: SharedService) {

    }

    ngOnInit(): void {

    }

    public changeUsername(){
      if(this.changeNamesForm.valid)
      {
        this.changeNamesData={
          UserId:this.sharedService.userData.Id,
          FirstName:this.changeNamesForm.value.firstName,
          LastName:this.changeNamesForm.value.lastName
        }
        this.loading=true;
        this.accountSettingsService.changeNanes(this.changeNamesData).then((result: any) => {
          this.loading=false;
          this.sharedService.userData.FirstName=this.changeNamesData.FirstName;
          this.sharedService.userData.LastName=this.changeNamesData.LastName;
          this.closeChangeNames.emit(true);
        },error=>{
          this.loading=false;
          this.serverErrorMessage=error;
          console.error(error);
        });
      }else{
        this.serverErrorMessage=undefined;
        this.changeNamesForm.markAllAsTouched();
      }
    }



}
