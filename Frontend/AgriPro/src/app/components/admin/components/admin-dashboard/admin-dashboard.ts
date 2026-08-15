import { ChangeDetectorRef, Component } from '@angular/core';
import { AdminDashAlerts } from './components/admin-dash-alerts/admin-dash-alerts';
import { AdminDashApprovals } from './components/admin-dash-approvals/admin-dash-approvals';
import { AdminDashCards } from './components/admin-dash-cards/admin-dash-cards';
import { AdminDashDistribution } from './components/admin-dash-distribution/admin-dash-distribution';
import { AdminDashActivity } from './components/admin-dash-activity/admin-dash-activity';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../services/adminService/admin.service';
import { AdminDashboardResponse } from '../../../../models/admin-dashboard';

@Component({
  selector: 'app-admin-dashboard',
  imports: [AdminDashAlerts, AdminDashApprovals, AdminDashCards, AdminDashDistribution, AdminDashActivity,CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboard {
  dashboardData: AdminDashboardResponse | null = null;
  isLoading = true;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.adminService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.isLoading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error fetching dashboard data:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
