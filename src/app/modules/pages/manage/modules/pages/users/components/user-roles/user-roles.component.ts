import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { UserService } from '../../services/user.service';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { UserWithRoles } from '../../models/user-roles.model';
import { UserRole } from '../../models/user-role.model';
import { SnackBarType } from 'src/app/modules/shared/components/custom-snack-bar/custom-snack-bar.component';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent implements OnInit{
  showLoading:boolean=false;
  user:UserWithRoles;

	constructor(
    private snackbarService:SnackBarService,
    private activatedRoute:ActivatedRoute,
    private userService:UserService) {

	}

  ngOnInit(): void {
    var userId=this.activatedRoute.snapshot.params.userId;
    if(userId)
    {
      this.userService.getWithRoles(userId).then((response:SinovadApiGenericResponse)=>{
        this.user=response.Data;
      },error=>{
        console.error(error);
      });
    }
  }

  public saveUserRoles(){
    this.showLoading=true;
    this.userService.updateWithRoles(this.user.Id,this.user.UserRoles).then(response=>{
      this.snackbarService.showSnackBar("Se guardaron los roles del usuario satisfactoriamente",SnackBarType.Success);
      this.showLoading=false;
    },error=>{
      this.showLoading=false;
    });
  }

  public onChangeCheckValue(event:any,item:UserRole)
  {
    item.Enabled=event.target.checked;
  }

}
