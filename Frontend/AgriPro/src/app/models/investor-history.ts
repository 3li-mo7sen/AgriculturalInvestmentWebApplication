export interface HistoryItem {
  projectName: string;
  amount: number;
  profit: number;
  roi: string;
  status: string;
  completionDate: string | null;
}

export interface InvestmentHistoryResponse {
  totalInvested: number;
  totalReturned: number;
  totalProfit: number;
  activeInvestments: number;
  completedInvestments: number;
  history: HistoryItem[];
}
