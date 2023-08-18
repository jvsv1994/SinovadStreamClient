
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ChangePasswordModel } from '../shared/models/change-password.model';
import { AccountSettingsService } from '../shared/services/account-settings.service';

declare var window;
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss','../shared/styles/account-settings-section.scss']
})
export class ChangePasswordPage implements OnInit {

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
    public sharedService: SharedService) {

    }

    ngOnInit(): void {

    }

    public changePasword(){
      if(this.changePasswordForm.valid)
      {
        this.changePasswordData={
          UserId:this.sharedService.userData.Id,
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
