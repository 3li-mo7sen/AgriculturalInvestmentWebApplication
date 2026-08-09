import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BackendDashboardResponse, ExpertDashboardData, RecentReview } from '../../models/expert-dashboard';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { environment } from '../../../environment/environment';
import { VerifiedProject } from '../../models/expert-verified';
import { RejectedProject } from '../../models/expert-rejected';
import { PendingProject, RejectProjectRequest, VerifyProjectRequest } from '../../models/expert-pending';

@Injectable({
  providedIn: 'root',
})
export class ExpertService {
  constructor(private http: HttpClient) { }

  getDashboardData(): Observable<ExpertDashboardData> {
    const dashboard$ = this.http.get<any>(`${environment.baseUrl}/api/Expert/Get-Expert-Dashboard`);

    
    const rejected$ = this.http.get<any[]>(`${environment.baseUrl}/api/Expert/Get-Rejected-Projects`).pipe(
      catchError(() => of([])) 
    );

    return forkJoin([dashboard$, rejected$]).pipe(
      map(([res, rejectedProjects]) => {
       
        const pendingObj = res.stats?.find((s: any) => s.title === 'Pending Reviews');
        const verifiedObj = res.stats?.find((s: any) => s.title === 'Verified Projects');
        const rejectedObj = res.stats?.find((s: any) => s.title === 'Rejected Projects');
        const totalObj = res.stats?.find((s: any) => s.title === 'Total Reviews');

        const pendingCount = pendingObj ? parseInt(pendingObj.value, 10) : 0;
        const verifiedCount = verifiedObj ? parseInt(verifiedObj.value, 10) : 0;
        const rejectedCount = rejectedObj ? parseInt(rejectedObj.value, 10) : 0;
        const totalCount = totalObj ? parseInt(totalObj.value, 10) : (verifiedCount + rejectedCount + pendingCount);

        const completedCount = verifiedCount + rejectedCount;
        const approvalRateValue = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) + '%' : '0%';

        const mappedRecentReviews: RecentReview[] = [];

       
        if (Array.isArray(res.recentItems)) {
          res.recentItems.forEach((item: any) => {
            mappedRecentReviews.push({
              id: item.id,
              projectName: item.projectTitle || item.name,
              farmerName: item.farmer || item.farmerName,
              status: 'Pending',
              submissionDate: new Date().toISOString()
            });
          });
        }

      
        if (res.extra?.recentlyVerified && Array.isArray(res.extra.recentlyVerified)) {
          res.extra.recentlyVerified.forEach((item: any) => {
            mappedRecentReviews.push({
              id: item.id,
              projectName: item.projectTitle || item.name,
              farmerName: item.farmer || item.farmerName,
              status: item.status || 'Approved',
              submissionDate: new Date().toISOString()
            });
          });
        }

        
        if (Array.isArray(rejectedProjects)) {
          rejectedProjects.forEach((item: any) => {
            mappedRecentReviews.push({
              id: item.id,
              projectName: item.projectName || item.projectTitle || item.name,
              farmerName: item.farmerName || item.farmer,
              status: 'Rejected',
              submissionDate: item.rejectedAt || new Date().toISOString()
            });
          });
        }

        return {
          pendingReviews: pendingCount,
          completedReviews: completedCount,
          approvalRate: approvalRateValue,
          averageReviewTime: 1,
          recentReviews: mappedRecentReviews
        };
      })
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

  getPendingProjects(): Observable<PendingProject[]> {
    return this.http.get<PendingProject[]>(
      `${environment.baseUrl}/api/Expert/Get-Pending-Projects`
    );
  }

  
  verifyProject(id: number, body: VerifyProjectRequest = {}): Observable<any> {
    return this.http.put(
      `${environment.baseUrl}/api/Expert/Verify-Project/${id}`,
      body
    );
  }

  
  rejectProject(id: number, body: RejectProjectRequest): Observable<any> {
    return this.http.put(
      `${environment.baseUrl}/api/Expert/Reject-Project/${id}`,
      body
    );
  }
}
