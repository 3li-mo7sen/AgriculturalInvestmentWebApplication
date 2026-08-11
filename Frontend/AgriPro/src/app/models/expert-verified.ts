export interface VerifiedProject {
  id: number;
  name: string; 
  cost: number;
  fundingRaised: number;
  fundingProgress: number; 
  expectedProfit: number;
  duration: number;
  farmerId: number;
  farmerName: string;
  imageUrl?: string;
  status: string;
  shortDescription?: string;
  fullDescription?: string;
  cropType?: string;
  governorate?: string;
  district?: string;
  landSize?: number;
  soilType?: string;
  waterSource?: string;
  investorsCount?: number;
  verificationDate?: string;
  verificationNotes?: string;

  landOwnershipDocUrl?: string | null;
  nationalIdDocUrl?: string | null;
  agriculturalPermitDocUrl?: string | null;
  waterRightsDocUrl?: string | null;
}
export interface SummaryCard {
  label: string;
  value: string;
  icon: string;

}
