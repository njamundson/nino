import { Brand } from './brand';

export interface Opportunity {
  id: string;
  brand_id: string;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string | null;
  requirements: string[] | null;
  perks: string[] | null;
  compensation_type: string | null;
  compensation_amount: number | null;
  location: string | null;
  payment_details: string | null;
  compensation_details: string | null;
  deliverables: string[] | null;
  image_url: string | null;
  created_at: string | null;
  updated_at: string | null;
  brand?: Brand;
}

export interface Application {
  id: string;
  opportunity_id: string;
  creator_id: string;
  status: string | null;
  cover_letter: string | null;
  created_at: string | null;
  updated_at: string | null;
  initiated_by: 'creator' | 'brand';
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