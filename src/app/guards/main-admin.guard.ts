import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { tap } from 'rxjs';
import { MenuService } from '../modules/pages/manage/modules/pages/menus/services/menu.service';
import { SharedDataService } from '../services/shared-data.service';
import { Roles } from '../modules/shared/enums/enums';

export const mainAdminGuard: CanActivateFn = (route, state) => {
  const sharedDataService=inject(SharedDataService);
  const menuService=inject(MenuService);
  const router=inject(Router);
  if(menuService.loadedManageMenu)
  {
    if(sharedDataService.roles && sharedDataService.roles.findIndex(rol=>rol.Id==Roles.MainAdministrator)!=-1)
    {
      return true;
    }else{
      return router.navigateByUrl("/home");
    }
  }else{
    return menuService.isCompletedLoadUserManageMenu().pipe(tap(x=>{
      if(sharedDataService.roles && sharedDataService.roles.findIndex(rol=>rol.Id==Roles.MainAdministrator)!=-1)
      {
        return true;
      }else{
        return router.navigateByUrl("/home");
      }
    }));
  }
};

