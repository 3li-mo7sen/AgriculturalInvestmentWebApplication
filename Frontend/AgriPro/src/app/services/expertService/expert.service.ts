import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExpertDashboardData } from '../../models/expert-dashboard';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { VerifiedProject } from '../../models/expert-verified';
import { RejectedProject } from '../../models/expert-rejected';

@Injectable({
  providedIn: 'root',
})
export class ExpertService {
  constructor(private http: HttpClient) { }

  getDashboardData(): Observable<ExpertDashboardData> {
    return this.http.get<ExpertDashboardData>(
      `${environment.baseUrl}/api/Expert/Get-Expert-Dashboard`
    );
  }

  getVerifiedProjects(): Observable<VerifiedProject[]> {
    return this.http.get<VerifiedProject[]>(
      `${environment.baseUrl}/api/Expert/Get-Verified-Projects`
    );
  }

  getRejectedProjects(): Observable<RejectedProject[]> {
    return this.http.get<RejectedProject[]>(
      `${environment.baseUrl}/api/Expert/Get-Rejected-Projects`
    );
  }
  
}
