import { ChangeDetectorRef, Component } from '@angular/core';
import { InvestDashCards } from './components/invest-dash-cards/invest-dash-cards';
import { InvestDashInvestments } from './components/invest-dash-investments/invest-dash-investments';
import { InvestDashProjects } from './components/invest-dash-projects/invest-dash-projects';
import { CommonModule } from '@angular/common';
import { InvestorService } from '../../../../services/investorService/investor.service';
import { InvestorDashboardResponse } from '../../../../models/investor-dashboard';
import { finalize } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-investor-dashboard',
  imports: [InvestDashCards, InvestDashInvestments, InvestDashProjects,CommonModule],
  templateUrl: './investor-dashboard.html',
  styleUrls: ['./investor-dashboard.css'],
})
export class InvestorDashboard {
  dashboardData: InvestorDashboardResponse | null = null;
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

    this.investorService.getInvestorDashboard()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (data) => {
          this.dashboardData = data;
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
