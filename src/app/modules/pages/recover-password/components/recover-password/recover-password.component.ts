
import { Component } from '@angular/core';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { RecoverPasswordModel } from '../../models/recover-password.model';
import { UserService } from '../../../manage/modules/pages/users/services/user.service';

declare var window;
@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent {

  _window=window;
  title: string;
  errorMessage: string;
  showLoading:boolean=false;
  customKeyboardControlsEvent:any;
  recoverPasswordModel=new RecoverPasswordModel();
  sendedConfirmationEmail:boolean=false;
  recoverPasswordForm = this.formBuilder.group({
    email: new FormControl("", [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public userService: UserService,
    public commonService: CommonService,
    public sharedDataService: SharedDataService) {

    }

  public SendRecoverPasswordEmail(){
    if(this.recoverPasswordForm.valid)
    {
      this.recoverPasswordModel={
        Email:this.recoverPasswordForm.value.email,
        ResetPasswordUrl:window.location.origin+"/reset"
      }
      this.showLoading=true;
      this.userService.recoverPassword(this.recoverPasswordModel).then((result: any) => {
        this.sendedConfirmationEmail=true;
        this.showLoading=false;
      },error=>{
        this.showLoading=false;
        this.errorMessage=error;
        console.error(error);
      });
    }else{
      this.errorMessage=undefined;
      this.recoverPasswordForm.markAllAsTouched();
    }
  }

  public onClose(){
    this.router.navigate(['landing'],{ skipLocationChange: false});
  }

}
