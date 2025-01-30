export type CreatorType = 'Model/Talent' | 'Photographer' | 'Videographer' | 'Content Creator';

export interface Creator {
  id: string;
  user_id?: string;
  bio: string;
  location: string;
  specialties: string[];
  instagram: string;
  website: string;
  first_name: string;
  last_name: string;
  profile_image_url: string;
  creator_type: CreatorType;
}

export interface CreatorData extends Creator {
  user_id: string;
}