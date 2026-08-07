export interface VerifiedProject {
  id: number;
  title: string;
  farmerName: string;
  status: string;
  verificationDate: string;
  verificationNotes: string;
  investorsCount: number;
  fundingRaised: number;
}
export interface SummaryCard {
  label: string;
  value: string;
  icon: string;
}
