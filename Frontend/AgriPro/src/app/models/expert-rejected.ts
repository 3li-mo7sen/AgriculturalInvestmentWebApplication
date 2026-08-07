export interface RejectedProject {
  id: number;
  title: string;
  farmerName: string;
  status: string;
  rejectionDate: string;
  rejectionReason: string;
  resubmissionAllowed: boolean;
}
