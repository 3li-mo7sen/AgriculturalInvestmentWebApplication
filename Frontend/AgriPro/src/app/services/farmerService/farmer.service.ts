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
    return this._http.get(`${environment.baseUrl}/api/Farmer/dashboard`);
  }
  getMyProjects(): Observable<any[]> {
    // مش محتاجين نبعت الهيدر يدوياً لأن الـ Interceptor اللي عملناه هيقوم بالواجب
    return this._http.get<any[]>(`${environment.baseUrl}/api/Project/my-projects`);
  }
  
}
