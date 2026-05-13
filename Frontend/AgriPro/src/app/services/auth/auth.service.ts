import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environment/environment.development';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any = null;

  constructor(
    private _HttpClient: HttpClient,
    private _Router: Router
  ) {
    // استرجاع الحالة عند عمل Refresh
    this.loadUserFromStorage();
  }

  login(data: object) {
    return this._HttpClient.post(`${environment.baseUrl}/api/Auth/login`, data, {
      withCredentials: true // مهم جداً للكوكيز
    });
  }

  saveUserStatus(res: any) {
    this.userData = res.user;
    sessionStorage.setItem('userRole', res.role);
  }

  private loadUserFromStorage() {
    const savedRole = sessionStorage.getItem('userRole');
    if (savedRole) {
      this.userData = { role: savedRole };
    }
  }

  getRole(): string | null {
    if (this.userData && this.userData.role) {
      return this.userData.role;
    }
    return sessionStorage.getItem('userRole');
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('userRole');
  }

  logout(): void {
    this._HttpClient.post(`${environment.baseUrl}/api/Auth/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.userData = null;
        sessionStorage.clear();
        this._Router.navigate(['/login']);
      },
      error: (err) => {console.log("error: ",err) }
    });
  }

  redirectUser() {
    const role = this.getRole();
    if (role === 'Admin') this._Router.navigate(['/admin']);
    else if (role === 'Expert') this._Router.navigate(['/expert']);
    else if (role === 'Farmer') this._Router.navigate(['/farmer']);
    else if (role === 'Investor') this._Router.navigate(['/investor']);
  }
}
