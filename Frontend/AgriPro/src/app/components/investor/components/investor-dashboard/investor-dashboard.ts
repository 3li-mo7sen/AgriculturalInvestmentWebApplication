import { ChangeDetectorRef, Component } from '@angular/core';
import { InvestDashCards } from './components/invest-dash-cards/invest-dash-cards';
import { InvestDashInvestments } from './components/invest-dash-investments/invest-dash-investments';
import { InvestDashProjects } from './components/invest-dash-projects/invest-dash-projects';
import { CommonModule } from '@angular/common';
import { InvestorService } from '../../../../services/investorService/investor.service';
import { AvailableProjectItem, InvestorDashboardResponse } from '../../../../models/investor-dashboard';
import { finalize, forkJoin } from 'rxjs';
import { environment } from '../../../../../environment/environment';
import { Project } from '../../../../models/investor-projects';

@Component({
  standalone: true,
  selector: 'app-investor-dashboard',
  imports: [InvestDashCards, InvestDashInvestments, InvestDashProjects,CommonModule],
  templateUrl: './investor-dashboard.html',
  styleUrls: ['./investor-dashboard.css'],
})
export class InvestorDashboard {
  dashboardData: InvestorDashboardResponse | null = null;
  featuredProjects: AvailableProjectItem[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private investorService: InvestorService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';

   
    forkJoin({
      dashboard: this.investorService.getInvestorDashboard(),
      approvedProjects: this.investorService.getAllProjects()
    })
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: ({ dashboard, approvedProjects }) => {
          this.dashboardData = dashboard;

         
          this.featuredProjects = approvedProjects.map((proj: Project) => ({
            id: proj.id,
            title: proj.name,
            location: proj.governorate ? `${proj.governorate}${proj.district ? ', ' + proj.district : ''}` : '',
            cropType: proj.cropType ?? undefined, 
            expectedRoi: proj.expectedProfit ? `${proj.expectedProfit}%` : 'N/A',
            minInvestment: proj.minimumInvestment || proj.cost,
            fundingProgress: proj.fundingProgress || 0,
            imageUrl: proj.imageUrl ? `${environment.baseUrl}${proj.imageUrl}` : undefined
          }));

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching dashboard data:', err);
          this.errorMessage = 'Failed to load dashboard data. Please try again.';
          this.cdr.detectChanges();
        }
      });
  }
}

