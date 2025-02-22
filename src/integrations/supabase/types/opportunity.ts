import { Brand } from './brand';
import { Application } from './application';

export interface Opportunity {
  id: string;
  brand_id: string;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  requirements: string[] | null;
  perks: string[] | null;
  location: string | null;
  payment_details: string | null;
  compensation_details: string | null;
  compensation_type: string | null;
  compensation_amount: number | null;
  deliverables: string[] | null;
  image_url: string | null;
  created_at?: string;
  updated_at?: string;
  brand?: Partial<Brand>;
  applications?: Application[];
}