export type OnboardingStep = "basic" | "social" | "professional" | "payment";

export interface CreatorProfile {
  firstName: string;
  lastName: string;
  bio: string;
  profileImage: string | null;
  instagram: string;
  website?: string;
  creatorType: string;
  skills: string[];
  location: string;
}

export interface Creator {
  id: string;
  bio: string | null;
  location: string | null;
  specialties: string[] | null;
  user_id: string;
  profile: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}