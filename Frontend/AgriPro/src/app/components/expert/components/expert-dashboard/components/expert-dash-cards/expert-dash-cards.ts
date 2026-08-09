import { CommonModule } from '@angular/common';
import { Component, Input, input, OnChanges } from '@angular/core';
import { ExpertDashboardData } from '../../../../../../models/expert-dashboard';

interface ExpertCard {
  title: string;
  value: string;
  meta: string;
  icon: string;
  iconClass: string;
}

@Component({
  standalone: true,
  selector: 'app-expert-dash-cards',
  imports: [CommonModule],
  templateUrl: './expert-dash-cards.html',
  styleUrls: ['./expert-dash-cards.css'],
})
export class ExpertDashCards implements OnChanges{
  @Input() data: ExpertDashboardData|null=null;

  cards: ExpertCard[] = [];

  ngOnChanges(): void {
    if (this.data) {
      this.cards = [
        {
          title: 'Pending Reviews',
          value: String(this.data.pendingReviews ?? 0),
          meta: 'Awaiting your review',
          icon: 'fa-regular fa-clock',
          iconClass: 'icon-warning'
        },
        {
          title: 'Completed Reviews',
          value: String(this.data.completedReviews ?? 0),
          meta: 'Successfully processed',
          icon: 'fa-regular fa-circle-check',
          iconClass: 'icon-success'
        },
        {
          title: 'Approval Rate',
          value: this.data.approvalRate ?? '0%',
          meta: 'Overall acceptance',
          icon: 'fa-regular fa-chart-bar',
          iconClass: 'icon-info'
        }
      ];
    }
  }
}
