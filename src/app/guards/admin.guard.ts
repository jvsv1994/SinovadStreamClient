import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { tap } from 'rxjs';
import { MenuService } from '../modules/pages/manage/modules/pages/menus/services/menu.service';
import { CommonService } from '../services/common.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const commonService=inject(CommonService);
  const menuService=inject(MenuService);
  const router=inject(Router);
  if(menuService.loadedManageMenu)
  {
    if(commonService.checkIfIsEnableMenuOptionByPath(route.routeConfig.path))
    {
      return true;
    }else{
      return router.navigateByUrl("/home");
    }
  }else{
    return menuService.isCompletedLoadUserManageMenu().pipe(tap(x=>{
      if(commonService.checkIfIsEnableMenuOptionByPath(route.routeConfig.path))
      {
        return true;
      }else{
        return router.navigateByUrl("/home");
      }
    }));
  }
};

