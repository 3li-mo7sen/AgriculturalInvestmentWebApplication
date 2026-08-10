export interface Project {
  id: number;
  name: string;
  cost: number; 
  fundingRaised: number;
  fundingProgress: number;
  expectedProfit: number; 
  duration: number;
  farmerId: number;
  farmerName: string;
  imageUrl: string | null;
  status: string;
  shortDescription: string | null;
  fullDescription: string | null;
  cropType: string | null;
  governorate: string | null;
  district: string | null;
  landSize: number;
  soilType: string | null;
  waterSource: string | null;
  landOwnershipType: string | null;
  expectedCropSeason: string | null;
  minimumInvestment: number; 
  farmerProfitShare: number;
  investorProfitShare: number;
  landOwnershipDocUrl: string | null;
  nationalIdDocUrl: string | null;
  agriculturalPermitDocUrl: string | null;
  waterRightsDocUrl: string | null;
  rejectionReason: string | null;
}

export interface ProjectFilter {
  searchQuery?: string;
  cropType?: string;
  location?: string;
  sortByProgress?: 'asc' | 'desc' | null;
}
