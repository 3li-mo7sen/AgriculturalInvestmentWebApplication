import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ReviewItem {
  project: string;
  location: string;
  landDetails: string;
  farmer: string;
  phone: string;
  submitted: string;
  size: string;
  crop: string;
  soilType: string;
  water: string;
  ownership: string;
  documents: { pdf: number; images: number };
  documentsList: { name: string; type: string }[];
  fundingGoal: string;
  expectedROI: string;
  urgency: 'High' | 'Medium' | 'Low';
}

@Component({
  selector: 'app-expert-reviews-list',
  imports: [CommonModule],
  templateUrl: './expert-reviews-list.html',
  styleUrl: './expert-reviews-list.css',
})
export class ExpertReviewsList {
  @Input() reviews: ReviewItem[] = [];

  selectedReview: ReviewItem | null = null;

  openReview(review: ReviewItem) {
    this.selectedReview = review;
  }

  closeReview() {
    this.selectedReview = null;
  }
}
