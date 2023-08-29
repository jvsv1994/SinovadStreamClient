import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SharedService } from '../services/shared-data.service';
import { MenuService } from 'src/app/modules/menus/shared/menu.service';
import { tap } from 'rxjs';

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

