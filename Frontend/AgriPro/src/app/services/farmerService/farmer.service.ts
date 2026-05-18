import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FarmerService {
  constructor(private _http: HttpClient) { }

  getDashboardData(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/api/Farmer/Get-Farmer-Dashboard`).pipe(
      map((dashboard) => this.mapDashboard(dashboard))
    );
  }

  getMyProjects(): Observable<any[]> {
    return this._http.get<any[]>(`${environment.baseUrl}/api/Project/Get-My-Projects`).pipe(
      map((projects) => projects.map((project) => this.mapProject(project)))
    );
  }

  getProjectById(id: number) {
    return this._http.get<any>(`${environment.baseUrl}/api/Project/Get-Project-By-Id/${id}`).pipe(
      map((project) => this.mapProject(project))
    );
  }

  getProjectsByStatus(status: string) {
    return this._http.get<any[]>(`${environment.baseUrl}/api/Project/Get-Projects-By-Status/${status}`).pipe(
      map((projects) => projects.map((project) => this.mapProject(project)))
    );
  }

  createProject(projectData: any) {
    return this._http.post(`${environment.baseUrl}/api/Project/Create-Project`, projectData);
  }

  getWallet(): Observable<any> {
    return this._http.get(`${environment.baseUrl}/api/Farmer/Get-Farmer-Wallet`);
  }

  getContracts(): Observable<any[]> {
    return this._http.get<any[]>(`${environment.baseUrl}/api/Farmer/Get-Farmer-Contracts`);
  }

  private mapDashboard(dashboard: any): any {
    const stats = dashboard?.stats ?? [];
    const statValue = (title: string, fallback: any = 0) =>
      stats.find((stat: any) => stat.title === title)?.value ?? fallback;

    const activeProjects = (dashboard?.recentItems ?? []).map((project: any) => ({
      id: project.id,
      name: project.projectTitle ?? project.name,
      title: project.projectTitle ?? project.name,
      status: project.status,
      fundingRaised: project.fundingRaised ?? 0,
      targetAmount: project.fundingGoal ?? project.targetAmount ?? 0,
      fundingProgress: project.fundingProgress ?? 0,
      investorsCount: project.investorCount ?? 0
    }));

    return {
      ...dashboard,
      totalProjects: Number(statValue('Total Projects')) || 0,
      activeProjectsCount: Number(statValue('Active Projects')) || 0,
      pendingReviews: Number(statValue('Pending Reviews')) || 0,
      totalFundingRaised: this.parseMoney(statValue('Total Raised')),
      totalInvestors: activeProjects.reduce((sum: number, project: any) => sum + (project.investorsCount || 0), 0),
      activeProjects
    };
  }

  private mapProject(project: any): any {
    return {
      ...project,
      title: project.title ?? project.name,
      targetAmount: project.targetAmount ?? project.cost ?? 0,
      fundingRaised: project.fundingRaised ?? 0,
      fundingProgress: project.fundingProgress ?? 0,
      investorsCount: project.investorsCount ?? project.investorCount ?? 0
    };
  }

  private parseMoney(value: any): number {
    if (typeof value === 'number') return value;
    return Number(String(value ?? '').replace(/[^\d.-]/g, '')) || 0;
  }

}
