
import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { RegisterUserModel } from '../../models/register-user-model';
import { UserService } from '../../../manage/modules/pages/users/services/user.service';

declare var window;
@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {

  _window=window;
  title: string;
  errorMessage: string;
  showLoading:boolean=false;
  showSuccessMessage:boolean=false;
  customKeyboardControlsEvent:any;
  registerUserModel:RegisterUserModel=new RegisterUserModel();
  registerUserForm = this.formBuilder.group({
    email: new FormControl("", [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    firstName: new FormControl("", [Validators.required]),
    lastName: new FormControl("", [Validators.required]),
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
    confirmPassword: new FormControl("", [Validators.required])
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public userService: UserService,
    public commonService:CommonService,
    public sharedDataService: SharedDataService) {

    }

    ngOnInit(): void {
    }

    public register(){
      if(this.registerUserForm.valid)
      {
        this.registerUserModel={
          Email:this.registerUserForm.value.email,
          FirstName:this.registerUserForm.value.firstName,
          LastName:this.registerUserForm.value.lastName,
          UserName:this.registerUserForm.value.username,
          Password:this.registerUserForm.value.password,
          ConfirmPassword:this.registerUserForm.value.confirmPassword,
          ConfirmEmailUrl:window.location.origin+"/confirm"
        }
        this.showLoading=true;
        this.userService.registerUser(this.registerUserModel).then((response: any) => {
          this.showLoading=false;
          this.showSuccessMessage=true;
        },error=>{
          this.showLoading=false;
          this.errorMessage=error;
          console.error(error);
        });
      }else{
        this.errorMessage=undefined;
        this.registerUserForm.markAllAsTouched();
      }
    }

    public onClose(){
      this.router.navigate(['landing'],{ skipLocationChange: false});
    }

}
