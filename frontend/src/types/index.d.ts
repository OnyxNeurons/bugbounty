export type Platform = {
  id: string;
  name: string;
  slug: string;
  hunterUsername?: string;
  type: string;
};

export type Program = {
  id: string;
  platformId: string;
  name: string;
  slug: string;
  vdp: boolean;
  favourite: boolean;
  tag?: string;
  url: string;
  type: string;
  bountyMin?: number;
  bountyMax?: number;
};

export type Report = {
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
};
