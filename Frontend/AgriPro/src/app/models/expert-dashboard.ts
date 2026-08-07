export interface RecentReview {
  id: number;
  projectName: string;
  farmerName: string;
  submissionDate: string;
  status: string;
  daysOld: number;
}

export interface ExpertDashboardData {
  pendingReviews: number;
  completedReviews: number;
  approvalRate: string;
  averageReviewTime: number;
  recentReviews: RecentReview[];
}

export interface ExpertCard {
  title: string;
  value: string | number;
  meta: string;
  icon: string;
  iconClass: string;
}

export interface PerformanceMetric {
  label: string;
  value: string | number;
  unit?: string;
}
