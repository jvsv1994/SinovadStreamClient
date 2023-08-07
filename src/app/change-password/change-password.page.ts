
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { HttpMethodType } from 'src/app/shared/enums';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ChangePasswordModel } from './change-password.model';

declare var window;
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss']
})
export class ChangePasswordPage extends ParentComponent implements OnInit {

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
    private formBuilder: FormBuilder,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)

    }

    ngOnInit(): void {

    }

    public changePasword(){
      if(this.changePasswordForm.valid)
      {
        this.changePasswordData={
          UserId:this.sharedData.userData.Id,
          Password:this.changePasswordForm.value.password,
          ConfirmPassword:this.changePasswordForm.value.confirmPassword,
          CurrentPassword:this.changePasswordForm.value.currentPassword
        }
        this.loading=true;
        this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/users/ChangePassword',this.changePasswordData).then((result: any) => {
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
