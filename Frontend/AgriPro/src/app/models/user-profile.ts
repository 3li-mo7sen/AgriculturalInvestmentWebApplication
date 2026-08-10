export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  emailConfirmed: boolean;
  status: string;
  kycStatus: string;
  phone: string;
  location: string;
  landDetails: string;
  specialization?: string | null;
  stats: {
    //farmer
    projectsCreated: number;
    totalFunding: number;
    avgRating: number;
    //expert
    totalReviews?: number;
    verifiedProjects?: number;
    rejectedProjects?: number;
    rating?: number;
  };

}
