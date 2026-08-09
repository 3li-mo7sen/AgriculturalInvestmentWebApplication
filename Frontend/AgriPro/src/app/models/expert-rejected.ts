export interface RejectedProject {
  id: number;
  name?: string;
  title?: string;
  farmerName: string;
  status?: string;
  rejectionDate?: string;
  rejectedAt?: string;
  rejectionReason: string;
  governorate?: string;
  district?: string;
  landSize?: number;
  cropType?: string;
}
