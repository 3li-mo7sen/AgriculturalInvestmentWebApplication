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
  userData: any=null;
  constructor(
    private _HttpClient: HttpClient,
    private _Router:Router
  ) { }

  login(data: object) {
    return this._HttpClient.post(`${environment.baseUrl}/api/Auth/login`, data);
  }

  saveToken(token:string){
    localStorage.setItem('token', token);
    this.decodeToken();
  }

  decodeToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.userData = jwtDecode(token);
    }
  }

  getRole(): string | null {
    if (!this.userData) return null;


    return this.userData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userData = null;
    this._Router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  isTokenExpired(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return true;

    const decoded: any = jwtDecode(token);

    return decoded.exp * 1000 < Date.now();
  }

  startAutoLogout() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const decoded: any = jwtDecode(token);

    const expiryTime = decoded.exp * 1000;
    const currentTime = Date.now();

    const timeout = expiryTime - currentTime;

    if (timeout > 0) {
      setTimeout(() => { this.logout(); }, timeout);
    }
    else {
      this.logout();
    }
  }

  redirectUser() {
    const role = this.getRole();

    if (role == 'Admin') {
      this._Router.navigate(['/admin']);
    }
    else if (role == 'Expert') {
      this._Router.navigate(['/expert']);
    }
    else if (role == 'Farmer' || role == 'Investor') {
      this._Router.navigate(['/home'])
    }
  }
}
