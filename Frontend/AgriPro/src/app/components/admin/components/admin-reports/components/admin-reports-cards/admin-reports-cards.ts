import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AdminReportCard {
  title: string;
  value: string;
  description: string;
  icon: string;
  iconClass: string;
  badge: string;
  badgeClass: string;
}

@Component({
  selector: 'app-admin-reports-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-reports-cards.html',
  styleUrls: ['./admin-reports-cards.css'],
})
export class AdminReportsCards {
  cards: AdminReportCard[] = [
    {
      title: 'Total Users',
      value: '12,458',
      description: 'Active platform users',
      icon: 'fa-solid fa-user',
      iconClass: 'icon-blue',
      badge: '12.5%',
      badgeClass: 'badge-green',
    },
    {
      title: 'Active Projects',
      value: '847',
      description: 'Live investment projects',
      icon: 'fa-solid fa-layer-group',
      iconClass: 'icon-aqua',
      badge: '8.3%',
      badgeClass: 'badge-green',
    },
    {
      title: 'Total Invested',
      value: 'EGP 145.2M',
      description: 'Investments across projects',
      icon: 'fa-solid fa-dollar-sign',
      iconClass: 'icon-indigo',
      badge: '15.7%',
      badgeClass: 'badge-green',
    },
    {
      title: 'Average ROI',
      value: '18.5%',
      description: 'Return on investment',
      icon: 'fa-solid fa-chart-line',
      iconClass: 'icon-amber',
      badge: '2.1%',
      badgeClass: 'badge-green',
    },
  ];
}
