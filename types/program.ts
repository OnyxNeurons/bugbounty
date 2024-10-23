export type Program =  {
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
}
