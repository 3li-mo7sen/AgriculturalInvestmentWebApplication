import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth/auth.service";
import { catchError, throwError } from "rxjs";



export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const clonedRequest = req.clone({
    withCredentials: true 
  });

  return next(clonedRequest);

}
