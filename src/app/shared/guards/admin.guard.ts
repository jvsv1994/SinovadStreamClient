import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SharedService } from '../services/shared-data.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const sharedService=inject(SharedService);
  const router=inject(Router);
  var findOption=false;
  for (let index = 0; index < sharedService.manageMenus.length; index++) {
    const menu = sharedService.manageMenus[index];
    if(menu.ChildMenus && menu.ChildMenus.findIndex(x=>x.Path && x.Path.includes(route.routeConfig.path))!=-1)
    {
      findOption=true;
      break;
    }
  }
  if(findOption)
  {
    return true;
  }else{
    return router.navigateByUrl("/home");
  }
};
