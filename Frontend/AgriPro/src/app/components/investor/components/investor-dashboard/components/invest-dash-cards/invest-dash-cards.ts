import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardStat } from '../../../../../../models/investor-dashboard';

@Component({
  standalone: true,
  selector: 'app-invest-dash-cards',
  imports: [CommonModule],
  templateUrl: './invest-dash-cards.html',
  styleUrls: ['./invest-dash-cards.css'],
})
export class InvestDashCards {
  @Input() stats: DashboardStat[] = [];

  
  getIconClass(title: string): string {
    const t = title?.toLowerCase() || '';
    if (t.includes('wallet') || t.includes('balance')) return 'fa-wallet icon-4';
    if (t.includes('invested')) return 'fa-landmark icon-1';
    if (t.includes('return')) return 'fa-arrow-trend-up icon-2';
    if (t.includes('active')) return 'fa-chart-bar icon-3';
    return 'fa-chart-line icon-1';
  }
}
