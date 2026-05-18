import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FarmerService {
  constructor(private _http: HttpClient) { }

  getDashboardData(): Observable<any> {
    return this._http.get(`${environment.baseUrl}/api/Farmer/Get-Farmer-Dashboard`);
  }
  getMyProjects(): Observable<any[]> {

    return this._http.get<any[]>(`${environment.baseUrl}/api/Project/Get-My-Projects`);
  }

  // services/farmerService/farmer.service.ts

  getProjectById(id: number) {
    return this._http.get(`${environment.baseUrl}/api/Project/Get-Project-By-Id/${id}`, { withCredentials: true });
  }

  getProjectsByStatus(status: string) {
    return this._http.get<any[]>(`${environment.baseUrl}/api/Project/Get-Projects-By-Status/{status}`);
  }

  createProject(projectData: any) {
    return this._http.post(`${environment.baseUrl}/api/Project/Create-Project`, projectData);
  }


}
