import { Creator } from './creator';
import { Opportunity } from './opportunity';

export interface Application {
  id: string;
  opportunity_id: string;
  creator_id: string;
  status: string;
  cover_letter: string | null;
  created_at: string;
  updated_at: string;
  initiated_by: 'creator' | 'brand';
  creator?: Creator;
  opportunity?: Opportunity;
  is_invitation?: boolean;
}