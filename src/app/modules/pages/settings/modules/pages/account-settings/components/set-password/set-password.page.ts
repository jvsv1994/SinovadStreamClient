
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AccountSettingsService } from '../../services/account-settings.service';
import { SetPasswordModel } from '../../models/set-password.model';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { CommonService } from 'src/app/services/common.service';

declare var window;
@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.page.html',
  styleUrls: ['./set-password.page.scss','../../styles/account-settings-section.scss']
})
export class SetPasswordPage implements OnInit {

  serverErrorMessage:string=undefined;
  setPasswordData:SetPasswordModel;
  @Output() closeSetPassword=new EventEmitter();
  setPasswordForm = this.formBuilder.group({
    password: new FormControl("", [Validators.required]),
    confirmPassword: new FormControl("", [Validators.required])
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

    public setPassword(){
      if(this.setPasswordForm.valid)
      {
        this.setPasswordData={
          UserId:this.sharedDataService.userData.Id,
          Password:this.setPasswordForm.value.password,
          ConfirmPassword:this.setPasswordForm.value.confirmPassword
        }
        this.loading=true;
        this.accountSettingsService.setPassword(this.setPasswordData).then((result: any) => {
          this.loading=false;
          this.sharedDataService.userData.IsPasswordSetted=true;
          this.closeSetPassword.emit(true);
        },error=>{
          this.loading=false;
          this.serverErrorMessage=error;
          console.error(error);
        });
      }else{
        this.serverErrorMessage=undefined;
        this.setPasswordForm.markAllAsTouched();
      }
    }



}
