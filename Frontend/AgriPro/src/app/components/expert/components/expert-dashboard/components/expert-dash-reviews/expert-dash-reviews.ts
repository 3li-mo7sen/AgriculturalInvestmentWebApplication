import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RecentReview } from '../../../../../../models/expert-dashboard';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'verified':
      case 'approved':
        return 'priority-low'; 
      case 'pending':
        return 'priority-medium'; 
      case 'rejected':
        return 'priority-high'; 
      default:
        return 'priority-medium';
    }
  }

  onReviewClick(review: RecentReview): void {
    const status = review.status?.toLowerCase();

    if (status === 'pending') {
      this.router.navigate(['/expert/pending-reviews']); 
    } else if (status === 'verified' || status === 'approved') {
      this.router.navigate(['/expert/verified-projects']); 
    } else if (status === 'rejected') {
      this.router.navigate(['/expert/rejected-projects']); 
    }
  }
}
