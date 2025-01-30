import { Opportunity } from './opportunity';

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
  creator?: {
    id: string;
    first_name: string;
    last_name: string;
    profile_image_url: string;
    location: string;
    instagram: string;
    website: string;
    creator_type: string;
    specialties: string[];
    user_id: string;
  };
}