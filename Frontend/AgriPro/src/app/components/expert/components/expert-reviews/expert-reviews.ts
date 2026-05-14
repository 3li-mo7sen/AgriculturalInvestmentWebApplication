import { Component } from '@angular/core';
import { ExpertReviewsSearch } from './components/expert-reviews-search/expert-reviews-search';
import { ExpertReviewsList } from './components/expert-reviews-list/expert-reviews-list';

@Component({
  selector: 'app-expert-reviews',
  imports: [ExpertReviewsList,ExpertReviewsSearch],
  templateUrl: './expert-reviews.html',
  styleUrl: './expert-reviews.css',
})
export class ExpertReviews {

}
