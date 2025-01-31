import { Creator } from './creator';
import { Opportunity } from './opportunity';

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'invited';

export interface Application {
  id: string;
  opportunity_id: string;
  creator_id: string;
  status: ApplicationStatus;
  cover_letter: string | null;
  created_at: string | null;
  updated_at: string | null;
  initiated_by: 'brand' | 'creator';
  opportunity: Opportunity;
  creator: Creator;
}