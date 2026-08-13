export interface WalletTransaction {
  id: number;
  type: string;       
  description: string;
  amount: number;      
  date: string;
  status: string;    
  projectName?: string | null;
}

export interface InvestorWalletResponse {
  balance: number;
  totalInvested: number;
  totalReturns: number;
  totalRaised: number;
  transactions: WalletTransaction[];
}
