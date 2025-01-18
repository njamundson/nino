export interface CreatorData {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  specialties: string[];
  instagram: string;
  website: string;
  location: string;
  profileImage: string | null;
  creatorType: string;
  profile?: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}