import { Brand } from './brand';
import { Application } from './application';

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
  applications?: Application[];
  current_creator_id?: string;
  application_status?: string;
  application_id?: string;
}

export type { Application } from './application';