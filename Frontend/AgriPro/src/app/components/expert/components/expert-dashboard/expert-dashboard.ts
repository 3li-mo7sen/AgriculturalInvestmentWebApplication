import { Component } from '@angular/core';
import { ExpertDashCards } from './components/expert-dash-cards/expert-dash-cards';
import { ExpertDashReviews } from './components/expert-dash-reviews/expert-dash-reviews';
import { ExpertDashActivity } from './components/expert-dash-activity/expert-dash-activity';
import { ExpertDashPerformance } from './components/expert-dash-performance/expert-dash-performance';

@Component({
  selector: 'app-expert-dashboard',
  imports: [ExpertDashCards,ExpertDashReviews,ExpertDashActivity,ExpertDashPerformance],
  templateUrl: './expert-dashboard.html',
  styleUrls: ['./expert-dashboard.css'],
})
export class ExpertDashboard {

}
