import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Project, ProjectFilter } from '../../models/investor-projects';
import { HttpClient } from '@angular/common/http';
import { Investment } from '../../models/investor-my-investments';
import { InvestmentHistoryResponse } from '../../models/investor-history';
import { InvestorDashboardResponse } from '../../models/investor-dashboard';

@Injectable({
  providedIn: 'root',
})
export class InvestorService {
  //private apiUrl = environment.baseUrl; 

  private filterSubject = new BehaviorSubject<ProjectFilter>({
    searchQuery: '',
    cropType: 'All Crops',
    location: 'All Locations',
    sortByProgress: null,
  });

  filter$ = this.filterSubject.asObservable();

  constructor(private http: HttpClient) { }
  //alternative for get-published-projects endpoint cuz it doesn't work correctly :(
  //this gets the approved projects only :(((
  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.baseUrl}/api/Project/Get-All-Projects`).pipe(
      map((projects) =>

        projects.filter(
          (p) =>

            p.status?.toLowerCase() === 'approved'
        )
      )
    );
  }

  updateFilter(newFilter: Partial<ProjectFilter>): void {
    this.filterSubject.next({
      ...this.filterSubject.value,
      ...newFilter,
    });
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${environment.baseUrl}/api/Project/Get-Project-By-Id/${id}`);
  }

  createInvestment(data: { projectId: number; amount: number }): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/api/Investment`, data);
  }

  getMyInvestments(): Observable<Investment[]> {
    return this.http.get<Investment[]>(`${environment.baseUrl}/api/Investment/my-investments`);
  }

  getInvestmentHistory(): Observable<InvestmentHistoryResponse> {
    return this.http.get<InvestmentHistoryResponse>(`${environment.baseUrl}/api/Investment/history`);
  }

  getInvestorDashboard(): Observable<InvestorDashboardResponse> {
    return this.http.get<InvestorDashboardResponse>(
      `${environment.baseUrl}/api/Investor/Get-Investor-Dashboard`
    );
  }
}
