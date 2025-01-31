import { Creator } from './creator';
import { Opportunity } from './opportunity';

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'invited';
export type InitiatedBy = 'brand' | 'creator';

export interface Application {
  id: string;
  opportunity_id: string;
  creator_id: string;
  status: ApplicationStatus;
  cover_letter: string | null;
  created_at: string;
  updated_at: string;
  initiated_by: InitiatedBy;
  opportunity?: Opportunity;
  creator?: Creator;
}