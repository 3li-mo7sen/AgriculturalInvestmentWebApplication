export interface PendingProject {
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
  cropType: string;
  governorate: string;
  district?: string;
  landSize: number;
  soilType?: string;
  waterSource?: string;
  landOwnershipType?: string;
  expectedCropSeason?: string;
  minimumInvestment?: number;
  farmerProfitShare?: number;
  investorProfitShare?: number;
  
 
  landOwnershipDocUrl?: string | null;
  nationalIdDocUrl?: string | null;
  agriculturalPermitDocUrl?: string | null;
  waterRightsDocUrl?: string | null;
  rejectionReason?: string | null;
}

export interface VerifyProjectRequest {
  notes?: string;
}

export interface RejectProjectRequest {
  reason: string;
}
