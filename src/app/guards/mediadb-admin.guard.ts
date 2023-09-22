import { CanActivateFn, Router } from '@angular/router';
import { Roles } from '../modules/shared/enums/enums';
import { SharedDataService } from '../services/shared-data.service';
import { MenuService } from '../modules/pages/manage/modules/pages/menus/services/menu.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs';

export const mediadbAdminGuard: CanActivateFn = (route, state) => {
  const sharedDataService=inject(SharedDataService);
  const menuService=inject(MenuService);
  const router=inject(Router);
  if(menuService.loadedManageMenu)
  {
    if(sharedDataService.roles && sharedDataService.roles.findIndex(rol=>rol.Id==Roles.MediaDbAdministrator || rol.Id==Roles.MainAdministrator)!=-1)
    {
      return true;
    }else{
      return router.navigateByUrl("/home");
    }
  }else{
    return menuService.isCompletedLoadUserManageMenu().pipe(tap(x=>{
      if(sharedDataService.roles && sharedDataService.roles.findIndex(rol=>rol.Id==Roles.MediaDbAdministrator || rol.Id==Roles.MainAdministrator)!=-1)
      {
        return true;
      }else{
        return router.navigateByUrl("/home");
      }
    }));
  }
};
