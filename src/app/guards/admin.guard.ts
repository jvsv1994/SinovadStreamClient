import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SharedService } from '../modules/shared/services/shared-data.service';
import { tap } from 'rxjs';
import { MenuService } from '../modules/pages/manage/modules/pages/menus/services/menu.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const sharedService=inject(SharedService);
  const menuService=inject(MenuService);
  const router=inject(Router);
  if(menuService.loadedManageMenu)
  {
    if(sharedService.checkIfIsEnableMenuOptionByPath(route.routeConfig.path))
    {
      return true;
    }else{
      return router.navigateByUrl("/home");
    }
  }else{
    return menuService.isCompletedLoadUserManageMenu().pipe(tap(x=>{
      if(sharedService.checkIfIsEnableMenuOptionByPath(route.routeConfig.path))
      {
        return true;
      }else{
        return router.navigateByUrl("/home");
      }
    }));
  }
};

