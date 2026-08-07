import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RecentReview } from '../../../../../../models/expert-dashboard';

interface Review {
  id: number;
  projectName: string;
  location: string;
  priority: 'High' | 'Medium' | 'Low';
  submittedBy: string;
  submittedTime: string;
  feddan: number;
  cropType: string;
  docs: number;
  images: number;
}

@Component({
  standalone: true,
  selector: 'app-expert-dash-reviews',
  imports: [CommonModule],
  templateUrl: './expert-dash-reviews.html',
  styleUrls: ['./expert-dash-reviews.css'],
})
export class ExpertDashReviews {
  @Input() reviews: RecentReview[] = [];

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'verified':
      case 'approved':
        return 'priority-low'; // green style
      case 'pending':
        return 'priority-medium'; // yellow style
      case 'rejected':
        return 'priority-high'; // red style
      default:
        return 'priority-medium';
    }
  }
}
