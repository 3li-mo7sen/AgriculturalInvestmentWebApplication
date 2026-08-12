export interface DashboardStat {
  title: string;
  value: string;
  description: string | null;
  change: string | null;
  changeType: string | null;
}

export interface RecentInvestmentItem {
  id?: number;
  projectName?: string;
  farmerName?: string;
  location?: string;
  status?: string;
  amountInvested?: number;
  expectedReturn?: number;
  roi?: string;
  dueDate?: string;
}

export interface AvailableProjectItem {
  id?: number;
  title?: string;
  location?: string;
  cropType?: string;
  expectedRoi?: string;
  minInvestment?: number;
  fundingProgress?: number;
  imageUrl?: string;
}

export interface InvestorDashboardResponse {
  stats: DashboardStat[];
  recentItems: RecentInvestmentItem[];
  extra: {
    availableProjects: AvailableProjectItem[];
  };
}
