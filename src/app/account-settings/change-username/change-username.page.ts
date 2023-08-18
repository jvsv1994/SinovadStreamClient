
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AccountSettingsService } from '../shared/services/account-settings.service';
import { ChangeUsernameModel } from '../shared/models/change-username.model';

declare var window;
@Component({
  selector: 'app-change-username',
  templateUrl: './change-username.page.html',
  styleUrls: ['./change-username.page.scss','../shared/styles/account-settings-section.scss']
})
export class ChangeUsernamePage implements OnInit {

  serverErrorMessage:string=undefined;
  changeUsernameData:ChangeUsernameModel;
  @Output() closeChangeUsername=new EventEmitter();
  changeUsernameForm = this.formBuilder.group({
    username: new FormControl(this.sharedService.userData.UserName, [Validators.required]),
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
      if(this.changeUsernameForm.valid)
      {
        this.changeUsernameData={
          UserId:this.sharedService.userData.Id,
          UserName:this.changeUsernameForm.value.username,
        }
        this.loading=true;
        this.accountSettingsService.changeUsername(this.changeUsernameData).then((result: any) => {
          this.loading=false;
          this.sharedService.userData.UserName=this.changeUsernameData.UserName;
          this.closeChangeUsername.emit(true);
        },error=>{
          this.loading=false;
          this.serverErrorMessage=error;
          console.error(error);
        });
      }else{
        this.serverErrorMessage=undefined;
        this.changeUsernameForm.markAllAsTouched();
      }
    }



}
