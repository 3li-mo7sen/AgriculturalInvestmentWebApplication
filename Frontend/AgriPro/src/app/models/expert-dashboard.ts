export interface StatItem {
  title: string;
  value: string;
  description: string | null;
  change: string | null;
  changeType: string | null;
}

export interface RecentItem {
  id: number;
  projectTitle: string;
  farmer: string;
  location: string;
  fundingGoal: number;
  expectedRoi: string;
}

export interface RecentlyVerifiedItem {
  id: number;
  projectTitle: string;
  farmer: string;
  location: string;
  status: string;
}


export interface BackendDashboardResponse {
  stats: StatItem[];
  recentItems: RecentItem[];
  extra?: {
    recentlyVerified: RecentlyVerifiedItem[];
  };
}


export interface RecentReview {
  id: number;
  projectName: string;
  farmerName: string;
  submissionDate?: string;
  status: string;
  daysOld?: number;
}

export interface ExpertDashboardData {
  pendingReviews: number;
  completedReviews: number;
  approvalRate: string;
  averageReviewTime: number;
  recentReviews: RecentReview[];
}
