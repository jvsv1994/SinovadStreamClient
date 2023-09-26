import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { tap } from 'rxjs';
import { SharedDataService } from '../services/shared-data.service';
import { Roles } from '../modules/shared/enums/enums';
import { UserService } from '../modules/pages/manage/modules/pages/users/services/user.service';

export const mainAdminGuard: CanActivateFn = (route, state) => {
  const sharedDataService=inject(SharedDataService);
  const userService=inject(UserService);
  const router=inject(Router);
  if(localStorage.getItem('apiToken')!=null)
  {
    return userService.isLoadedUserData().pipe(tap(response=>{
      if(sharedDataService.roles && sharedDataService.roles.findIndex(rol=>rol.Id==Roles.MainAdministrator)!=-1)
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

