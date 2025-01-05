export interface CreatorProfile {
  firstName: string;
  lastName: string;
  bio: string;
  profileImage: string | null;
  instagram: string;
  website: string;
  creatorType: string;
  skills: string[];
}

export type OnboardingStep = 'basic' | 'social' | 'professional';