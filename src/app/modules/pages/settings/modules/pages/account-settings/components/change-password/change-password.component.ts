
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AccountSettingsService } from '../../services/account-settings.service';
import { ChangePasswordModel } from '../../models/change-password.model';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { CommonService } from 'src/app/services/common.service';

declare var window;
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss','../../styles/account-settings-section.scss']
})
export class ChangePasswordComponent implements OnInit {

  serverErrorMessage:string=undefined;
  changePasswordData:ChangePasswordModel;
  @Output() closeChangePassword=new EventEmitter();
  changePasswordForm = this.formBuilder.group({
    password: new FormControl("", [Validators.required]),
    confirmPassword: new FormControl("", [Validators.required]),
    currentPassword: new FormControl("", [Validators.required])
  });
  loading:boolean=false;

  constructor(
    private accountSettingsService:AccountSettingsService,
    private formBuilder: FormBuilder,
    public commonService: CommonService,
    public sharedDataService: SharedDataService) {

    }

    ngOnInit(): void {

    }

    public changePasword(){
      if(this.changePasswordForm.valid)
      {
        this.changePasswordData={
          UserId:this.sharedDataService.userData.Id,
          Password:this.changePasswordForm.value.password,
          ConfirmPassword:this.changePasswordForm.value.confirmPassword,
          CurrentPassword:this.changePasswordForm.value.currentPassword
        }
        this.loading=true;
        this.accountSettingsService.changePassword(this.changePasswordData).then((result: any) => {
          this.loading=false;
          this.closeChangePassword.emit(true);
        },error=>{
          this.loading=false;
          this.serverErrorMessage=error;
          console.error(error);
        });
      }else{
        this.serverErrorMessage=undefined;
        this.changePasswordForm.markAllAsTouched();
      }
    }



}
