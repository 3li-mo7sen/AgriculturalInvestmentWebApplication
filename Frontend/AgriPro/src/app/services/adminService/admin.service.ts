import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AdminUser, CreateUserData } from '../../models/admin-accounts';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getUsers(role?: string, status?: string, search?: string): Observable<AdminUser[]> {
    let params = new HttpParams();

    if (role && role !== 'All Roles') {
      params = params.set('role', role);
    }
    if (status && status !== 'All Status') {
      params = params.set('status', status.toLowerCase());
    }
    if (search && search.trim() !== '') {
      params = params.set('search', search.trim());
    }

    return this.http.get<AdminUser[]>(`${this.baseUrl}/api/Admin/users`, { params });
  }

  createUser(userData: CreateUserData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/Admin/users`, userData);
  }
}
