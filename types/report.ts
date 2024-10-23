export type Report =  {
  id: string;
  platformId: string;
  programId: string;
  userId: string;
  title: string;
  reportId: string;
  bounty: number;
  currency: string;
  collab: boolean;
  status: string;
  cvssVector: string;
  cvss: number; 
  createdDate: Date;
  updatedDate: Date;
}
