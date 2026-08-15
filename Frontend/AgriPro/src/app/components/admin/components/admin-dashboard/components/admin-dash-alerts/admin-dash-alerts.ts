import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SystemAlertItem } from '../../../../../../models/admin-dashboard';

@Component({
  selector: 'app-admin-dash-alerts',
  imports: [CommonModule],
  templateUrl: './admin-dash-alerts.html',
  styleUrls: ['./admin-dash-alerts.css'],
})
export class AdminDashAlerts {
  @Input() alerts: SystemAlertItem[] = [];

  getAlertClass(type: string): string {
    switch (type?.toLowerCase()) {
      case 'info': return 'alert-info';
      case 'success': return 'alert-success';
      case 'warning': return 'alert-warning';
      case 'danger':
      case 'error': return 'alert-danger';
      default: return 'alert-info';
    }
  }

  getAlertIcon(type: string): string {
    switch (type?.toLowerCase()) {
      case 'info': return 'ℹ️';
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'danger':
      case 'error': return '🚨';
      default: return '🔔';
    }
  }
}
