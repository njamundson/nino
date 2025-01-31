export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'invited';
export type InitiatedBy = 'brand' | 'creator';

export interface Application {
  id: string;
  opportunity_id: string;
  creator_id: string;
  status: ApplicationStatus;
  cover_letter: string | null;
  created_at: string | null;
  updated_at: string | null;
  initiated_by: InitiatedBy;
  opportunity?: {
    title: string;
    description: string;
    brand: {
      company_name: string;
      profile_image_url: string | null;
    };
  };
  creator?: Creator;
}