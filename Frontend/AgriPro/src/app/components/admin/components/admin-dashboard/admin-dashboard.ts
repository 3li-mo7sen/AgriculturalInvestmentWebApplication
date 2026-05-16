import { Component } from '@angular/core';
import { AdminDashAlerts } from './components/admin-dash-alerts/admin-dash-alerts';
import { AdminDashApprovals } from './components/admin-dash-approvals/admin-dash-approvals';
import { AdminDashCards } from './components/admin-dash-cards/admin-dash-cards';
import { AdminDashDistribution } from './components/admin-dash-distribution/admin-dash-distribution';
import { AdminDashActivity } from './components/admin-dash-activity/admin-dash-activity';

@Component({
  selector: 'app-admin-dashboard',
  imports: [AdminDashAlerts, AdminDashApprovals, AdminDashCards, AdminDashDistribution, AdminDashActivity],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboard {

}
