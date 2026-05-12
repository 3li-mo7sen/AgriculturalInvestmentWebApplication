import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(AuthService);

  const expectedRole = route.data['role']; // بناخد الروال المطلوب من بيانات الراوت
  const userRole = auth.getRole(); // بنجيب الرول الحالي لليوزر

  if (auth.isLoggedIn() && userRole === expectedRole) {
    return true;
  }

  // لو الرول مش مظبوط نرجعه للهوم أو يظهر رسالة Unauthorized
  router.navigate(['/home']);
  return false;
};
