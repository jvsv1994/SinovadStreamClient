import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { SnackBarType } from 'src/app/modules/shared/components/custom-snack-bar/custom-snack-bar.component';
import { RoleService } from '../../services/role.service';
import { RoleWithMenus } from '../../models/role-menus.model';
import { RoleMenu } from '../../models/role-menu.model';

@Component({
  selector: 'app-role-menus',
  templateUrl: './role-menus.component.html',
  styleUrls: ['./role-menus.component.scss']
})
export class RoleMenusComponent implements OnInit{
  showLoading:boolean=false;
  role:RoleWithMenus;

	constructor(
    private snackbarService:SnackBarService,
    private activatedRoute:ActivatedRoute,
    private roleService:RoleService) {

	}

  ngOnInit(): void {
    var roleId=this.activatedRoute.snapshot.params.roleId;
    if(roleId)
    {
      this.roleService.getWithMenus(roleId).then((response:SinovadApiGenericResponse)=>{
        this.role=response.Data;
      },error=>{
        console.error(error);
      });
    }
  }

  public saveRoleMenus(){
    this.showLoading=true;
    this.roleService.updateWithMenus(this.role.Id,this.role.RoleMenus).then(response=>{
      this.snackbarService.showSnackBar("Se guardaron los menus del rol satisfactoriamente",SnackBarType.Success);
      this.showLoading=false;
    },error=>{
      this.showLoading=false;
    });
  }

  public getTargetFromEvent(event:any)
  {
    return event.target;
  }

}
