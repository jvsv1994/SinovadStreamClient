
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SharedService } from 'src/app/modules/shared/services/shared-data.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AccountSettingsService } from '../../services/account-settings.service';
import { SetPasswordModel } from '../../models/set-password.model';

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
    public sharedService: SharedService) {

    }

    ngOnInit(): void {

    }

    public setPassword(){
      if(this.setPasswordForm.valid)
      {
        this.setPasswordData={
          UserId:this.sharedService.userData.Id,
          Password:this.setPasswordForm.value.password,
          ConfirmPassword:this.setPasswordForm.value.confirmPassword
        }
        this.loading=true;
        this.accountSettingsService.setPassword(this.setPasswordData).then((result: any) => {
          this.loading=false;
          this.sharedService.userData.IsPasswordSetted=true;
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
