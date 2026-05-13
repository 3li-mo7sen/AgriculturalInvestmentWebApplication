import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(AuthService);

  // isLoggedIn() دلوقت بتعتمد على وجود userData في السيرفيس
  if (auth.isLoggedIn()) {
    return true;
  }

  // لو مش مسجل يروح للوجن
  router.navigate(['/login']);
  return false;
};
