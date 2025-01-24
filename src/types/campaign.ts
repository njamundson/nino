export interface Campaign {
  id: string;
  brand_id: string;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  requirements?: string[];
  perks?: string[];
  compensation_type?: string;
  compensation_amount?: number;
  location?: string;
  payment_details?: string;
  compensation_details?: string;
  deliverables?: string[];
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}