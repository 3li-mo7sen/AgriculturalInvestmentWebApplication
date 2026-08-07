import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ExpertDashboardData } from '../../../../../../models/expert-dashboard';

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
  @Input() data!: ExpertDashboardData;

  metrics: PerformanceMetric[] = [];

  ngOnChanges(): void {
    if (this.data) {
      this.metrics = [
        {
          label: 'Approval Rate',
          value: this.data.approvalRate ?? '0%',
          unit: ''
        },
        {
          label: 'Avg. Review Time',
          value: String(this.data.averageReviewTime ?? 0),
          unit: 'Days'
        },
        {
          label: 'Completed Reviews',
          value: String(this.data.completedReviews ?? 0),
          unit: 'Total'
        },
        {
          label: 'Pending Queue',
          value: String(this.data.pendingReviews ?? 0),
          unit: 'Items'
        }
      ];
    }
  }
}
