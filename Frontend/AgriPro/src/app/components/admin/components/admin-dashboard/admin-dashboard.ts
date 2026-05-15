import { Component } from '@angular/core';
import { AdminDashAlerts } from './components/admin-dash-alerts/admin-dash-alerts';
import { AdminDashApprovals } from './components/admin-dash-approvals/admin-dash-approvals';
import { AdminDashCards } from './components/admin-dash-cards/admin-dash-cards';
import { AdminDashDistribution } from './components/admin-dash-distribution/admin-dash-distribution';

@Component({
  selector: 'app-admin-dashboard',
  imports: [AdminDashAlerts,AdminDashApprovals,AdminDashCards,AdminDashApprovals,AdminDashDistribution],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {

}
