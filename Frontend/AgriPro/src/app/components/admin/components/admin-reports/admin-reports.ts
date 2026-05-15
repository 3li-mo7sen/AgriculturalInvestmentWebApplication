import { Component } from '@angular/core';
import { AdminReportsAlerts } from './components/admin-reports-alerts/admin-reports-alerts';
import { AdminReportsCards } from './components/admin-reports-cards/admin-reports-cards';
import { AdminReportsVolume } from './components/admin-reports-volume/admin-reports-volume';
import { AdminReportsGrowth } from './components/admin-reports-growth/admin-reports-growth';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-reports',
  imports: [AdminReportsCards,AdminReportsGrowth,AdminReportsVolume,RouterOutlet,RouterLinkActive,RouterLink],
  templateUrl: './admin-reports.html',
  styleUrl: './admin-reports.css',
})
export class AdminReports {

}
