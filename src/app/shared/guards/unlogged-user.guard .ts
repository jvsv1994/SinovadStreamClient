import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const unloggedUserGuard: CanActivateFn = (route, state) => {
  const router=inject(Router);
  if(localStorage.getItem('apiToken')==null)
  {
    return true;
  }else{
    return router.navigateByUrl("/landing");
  }
};
