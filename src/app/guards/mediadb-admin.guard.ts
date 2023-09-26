import { CanActivateFn, Router } from '@angular/router';
import { Roles } from '../modules/shared/enums/enums';
import { SharedDataService } from '../services/shared-data.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { UserService } from '../modules/pages/manage/modules/pages/users/services/user.service';

export const mediadbAdminGuard: CanActivateFn = (route, state) => {
  const sharedDataService=inject(SharedDataService);
  const userService=inject(UserService);
  const router=inject(Router);
  if(localStorage.getItem('apiToken')!=null)
  {
    return userService.isLoadedUserData().pipe(tap(response=>{
      if(sharedDataService.roles && sharedDataService.roles.findIndex(rol=>rol.Id==Roles.MediaDbAdministrator || rol.Id==Roles.MainAdministrator)!=-1)
      {
        return true;
      }else{
        return router.navigateByUrl("/home");
      }
    }));
  }else{
    return router.navigateByUrl("/landing");
  }
};

