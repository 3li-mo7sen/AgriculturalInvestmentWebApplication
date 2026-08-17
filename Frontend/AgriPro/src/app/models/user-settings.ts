export interface UpdateProfileRequest {
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  location?: string;
  landDetails?: string;
  farmInfo?: string;
  specialization?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AccountSettings {
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  investmentAlerts?: boolean;
  projectUpdates?: boolean;
  returnAlerts?: boolean;
  newProjectAlerts?: boolean;
  newReviewAlerts?: boolean;
  urgentReviewAlerts?: boolean;
  systemAlerts?: boolean;
  marketingEmails?: boolean;
  twoFactorAuth?: boolean;
  loginAlerts?: boolean;
  message?: string;
}
