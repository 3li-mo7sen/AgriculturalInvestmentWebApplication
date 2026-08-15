import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { StatItem } from '../../../../../../models/admin-dashboard';

@Component({
  selector: 'app-admin-dash-cards',
  imports: [CommonModule],
  templateUrl: './admin-dash-cards.html',
  styleUrls: ['./admin-dash-cards.css'],
})
export class AdminDashCards {
  @Input() stats: StatItem[] = [];

  getCardIcon(title: string): string {
    switch (title?.toLowerCase()) {
      case 'total users': return '👥';
      case 'active projects': return '📁';
      case 'total investments': return '💰';
      case 'pending reviews': return '⏳';
      default: return '📊';
    }
  }

  getCardThemeClass(title: string): string {
    switch (title?.toLowerCase()) {
      case 'total users': return 'theme-blue';
      case 'active projects': return 'theme-green';
      case 'total investments': return 'theme-emerald';
      case 'pending reviews': return 'theme-amber';
      default: return 'theme-purple';
    }
  }
}
