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
  stats: {
    projectsCreated: number;
    totalFunding: number;
    avgRating: number;
  };

}
