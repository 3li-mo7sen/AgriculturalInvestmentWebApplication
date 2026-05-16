import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DropdownOption {
  label: string;
  value: string;
}

interface ReportItem {
  title: string;
  category: string;
  generated: string;
  status: string;
  statusClass: string;
  type: string;
}

@Component({
  selector: 'app-admin-reports-reports',
  imports: [CommonModule],
  templateUrl: './admin-reports-reports.html',
  styleUrls: ['./admin-reports-reports.css'],
  standalone: true,
})
export class AdminReportsReports {
  typeOptions: DropdownOption[] = [
    { label: 'All Types', value: 'all' },
    { label: 'Performance', value: 'performance' },
    { label: 'Analytics', value: 'analytics' },
    { label: 'Financial', value: 'financial' },
    { label: 'Compliance', value: 'compliance' },
  ];

  selectedType: DropdownOption = this.typeOptions[0];
  isTypeMenuOpen = false;

  reports: ReportItem[] = [
    {
      title: 'Monthly Platform Performance',
      category: 'Performance',
      generated: '2024-01-15',
      status: 'Ready',
      statusClass: 'status-ready',
      type: 'performance',
    },
    {
      title: 'User Growth Analysis Q4',
      category: 'Analytics',
      generated: '2024-01-14',
      status: 'Ready',
      statusClass: 'status-ready',
      type: 'analytics',
    },
    {
      title: 'Investment Distribution Report',
      category: 'Financial',
      generated: '2024-01-13',
      status: 'Ready',
      statusClass: 'status-ready',
      type: 'financial',
    },
    {
      title: 'KYC Compliance Overview',
      category: 'Compliance',
      generated: '2024-01-12',
      status: 'Ready',
      statusClass: 'status-ready',
      type: 'compliance',
    },
  ];

  toggleTypeMenu(): void {
    this.isTypeMenuOpen = !this.isTypeMenuOpen;
  }

  selectType(option: DropdownOption): void {
    this.selectedType = option;
    this.isTypeMenuOpen = false;
  }

  filteredReports(): ReportItem[] {
    return this.reports.filter((item) => {
      return this.selectedType.value === 'all' || item.type === this.selectedType.value;
    });
  }
}
