import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { tap } from 'rxjs';
import { SharedService } from '../modules/shared/services/shared-data.service';
import { UserService } from '../modules/pages/manage/modules/pages/users/services/user.service';

export const loggedUserGuard: CanActivateFn = (route, state) => {
  const router=inject(Router);
  const sharedService=inject(SharedService);
  const userService=inject(UserService);
  if(localStorage.getItem('apiToken')!=null)
  {
    if(userService.calledGetUserData)
    {
      return true;
    }else{
      return userService.isCompletedCallGetUserData().pipe(tap(x=>{
          if(sharedService.userData!=null)
          {
            return true;
          }else{
            return router.navigateByUrl("/landing");
          }
      }));
    }
  }else{
    return router.navigateByUrl("/landing");
  }
};
