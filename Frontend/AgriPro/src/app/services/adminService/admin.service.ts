import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AdminUser, CreateUserData } from '../../models/admin-accounts';
import { Observable } from 'rxjs';
import { AdminDashboardResponse } from '../../models/admin-dashboard';
import { Project } from '../../models/admin-projects';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}
  //user api
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

  getUserById(id: number): Observable<AdminUser> {
    return this.http.get<AdminUser>(`${this.baseUrl}/api/Admin/users/${id}`);
  }

  createUser(userData: CreateUserData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/Admin/users`, userData);
  }

  updateUser(id: number, userData: Partial<AdminUser>): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/api/Admin/users/${id}`, userData);
  }

  updateUserStatus(id: number, status: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/api/Admin/users/${id}/status`, { status });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/api/Admin/users/${id}`);
  }

  getDashboardData(): Observable<AdminDashboardResponse> {
    return this.http.get<AdminDashboardResponse>(`${this.baseUrl}/api/Admin/dashboard`);
  }




  //project api

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/api/Project/Get-All-Projects`);
  }

  getProjectsByStatus(status: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/api/Project/Get-Projects-By-Status/${status}`);
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/Project/Delete-Project/${id}`, { responseType: 'text' as 'json' });
  }





}
