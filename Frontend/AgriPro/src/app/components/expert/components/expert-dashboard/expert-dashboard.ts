import { ChangeDetectorRef, Component } from '@angular/core';
import { ExpertDashCards } from './components/expert-dash-cards/expert-dash-cards';
import { ExpertDashReviews } from './components/expert-dash-reviews/expert-dash-reviews';
import { ExpertDashActivity } from './components/expert-dash-activity/expert-dash-activity';
import { ExpertDashPerformance } from './components/expert-dash-performance/expert-dash-performance';
import { ExpertDashboardData } from '../../../../models/expert-dashboard';
import { ExpertService } from '../../../../services/expertService/expert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expert-dashboard',
  imports: [ExpertDashCards,ExpertDashReviews,ExpertDashActivity,ExpertDashPerformance,CommonModule],
  templateUrl: './expert-dashboard.html',
  styleUrls: ['./expert-dashboard.css'],
})
export class ExpertDashboard {
  dashboardData: ExpertDashboardData | null = null;
  isLoading = true;

  constructor(
    private expertService: ExpertService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.isLoading = true;
    this.expertService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching expert dashboard data:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
