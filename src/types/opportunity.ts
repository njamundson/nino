import { Application } from './application';
import { Brand } from './brand';

export type OpportunityStatus = 'open' | 'active' | 'completed';

export interface Opportunity {
  id: string;
  brand_id: string;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  status: OpportunityStatus;
  requirements: string[] | null;
  perks: string[] | null;
  compensation_type: string | null;
  compensation_amount: number | null;
  location: string | null;
  payment_details: string | null;
  compensation_details: string | null;
  deliverables: string[] | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  brand?: Brand;
  applications?: Application[];
}