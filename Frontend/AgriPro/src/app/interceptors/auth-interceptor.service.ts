import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth/auth.service";
import { catchError, throwError } from "rxjs";



export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const authService = inject(AuthService);
  const token = localStorage.getItem('token');
    
  if (token) {
     req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status == 401) {
        console.warn('session expired. logging out...');
        authService.logout();
      }

      return throwError(() => error);
    })
  )


}
