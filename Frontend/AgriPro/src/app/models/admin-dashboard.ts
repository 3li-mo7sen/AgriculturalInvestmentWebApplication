export interface StatItem {
  title: string;
  value: string;
  description: string;
  change?: string | null;
  changeType?: string | null;
}

export interface UserDistributionItem {
  role: string;
  count: number;
}

export interface SystemAlertItem {
  type: string;
  message: string;
  createdAt: string;
}

export interface RecentActivityItem {
  title: string;
  timestamp: string;
}

export interface AdminDashboardResponse {
  stats: StatItem[];
  recentActivities: RecentActivityItem[];
  userDistribution: UserDistributionItem[];
  systemAlerts: SystemAlertItem[];
}
