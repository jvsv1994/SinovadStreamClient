import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { SelectionModel } from '@angular/cdk/collections';
import { Role } from '../../../roles/models/role.model';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent implements OnInit{
  showLoading:boolean=false;
  user:User;
  selection:SelectionModel<Role>;
  listRoles:Role[]=[];

	constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private snackbarService:SnackBarService,
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

  }

  public onChangeCheckValue(event:any,item:Role)
  {
    let addItems:boolean=event.target.checked;
    if(addItems)
    {
      this.selection.select(item);
    }else{
      this.selection.deselect(item);
    }
  }

}
