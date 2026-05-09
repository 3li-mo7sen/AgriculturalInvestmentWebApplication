import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {


  const auth = inject(AuthService);
  const router = inject(Router);


  const expectedRole = route.data?.['role'];
  const userRole = auth.getRole();


  if (userRole == expectedRole) {
    return true;
  }


  router.navigate(['/home']);
  return false;

};
