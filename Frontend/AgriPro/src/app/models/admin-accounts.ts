export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  kycStatus: string;
  phone: string | null;
  location: string | null;
  projectsCount: number;
  investmentsCount: number;
  reviewsCount: number;
}

export interface CreateUserData {
  name: string;
  email: string;
  password?: string;
  role: string;
  phoneNumber?: string;
  landDetails?: string;
  balance?: number;
}
