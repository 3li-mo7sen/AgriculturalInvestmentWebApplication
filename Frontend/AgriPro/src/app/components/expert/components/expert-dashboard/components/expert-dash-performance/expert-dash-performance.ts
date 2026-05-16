import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface PerformanceMetric {
  label: string;
  value: string;
  unit?: string;
}

@Component({
  standalone: true,
  selector: 'app-expert-dash-performance',
  imports: [CommonModule],
  templateUrl: './expert-dash-performance.html',
  styleUrls: ['./expert-dash-performance.css'],
})
export class ExpertDashPerformance {
  metrics: PerformanceMetric[] = [
    {
      label: 'Avg. Review Time',
      value: '2.4',
      unit: 'hours'
    },
    {
      label: 'Accuracy Rate',
      value: '98.5',
      unit: '%'
    },
    {
      label: 'Total Reviewed',
      value: '156',
      unit: ''
    },
    {
      label: 'Expert Rating',
      value: '4.9',
      unit: '/5'
    }
  ];
}
