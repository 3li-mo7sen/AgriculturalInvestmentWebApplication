export interface Investment {
  id: number;
  projectName: string;
  amount: number;
  date: string;
  expectedReturn: number;
  status: string;
  progressPercentage: number;
}
