import { Opportunity } from './opportunity';
import { Creator } from './creator';

export interface Application {
  id: string;
  opportunity_id: string;
  creator_id: string;
  status: string;
  cover_letter: string | null;
  created_at: string;
  updated_at: string;
  initiated_by: "creator" | "brand";
  opportunity?: Opportunity;
  creator?: Creator;
}