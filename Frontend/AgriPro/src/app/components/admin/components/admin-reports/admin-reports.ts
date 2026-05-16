import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminReportsAlerts } from './components/admin-reports-alerts/admin-reports-alerts';
import { AdminReportsCards } from './components/admin-reports-cards/admin-reports-cards';
import { AdminReportsVolume } from './components/admin-reports-volume/admin-reports-volume';
import { AdminReportsGrowth } from './components/admin-reports-growth/admin-reports-growth';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  standalone: true,
  selector: 'app-admin-reports',
  imports: [CommonModule, AdminReportsCards, AdminReportsGrowth, AdminReportsVolume, RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './admin-reports.html',
  styleUrls: ['./admin-reports.css'],
})
export class AdminReports {
  periodOptions: DropdownOption[] = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 3 months', value: '3m' },
    { label: 'Last 6 months', value: '6m' },
    { label: 'Last year', value: '1y' },
  ];

  selectedPeriod: DropdownOption = this.periodOptions[3];
  isPeriodMenuOpen = false;

  togglePeriodMenu(event: Event): void {
    event.stopPropagation();
    this.isPeriodMenuOpen = !this.isPeriodMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  closeMenuOnOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.isPeriodMenuOpen && !target.closest('.dropdown-filter')) {
      this.isPeriodMenuOpen = false;
    }
  }

  selectPeriod(option: DropdownOption): void {
    this.selectedPeriod = option;
    this.isPeriodMenuOpen = false;
  }
}
