import { FarmerWalletTransaction } from "./farmer-wallet-transaction";

export interface FarmerWalletData {
  balance: number;
  totalRaised: number;
  totalReturns: number;
  pendingReturns: number;
  transactions: FarmerWalletTransaction[];
}
