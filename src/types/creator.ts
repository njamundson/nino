export type OnboardingStep = "basic" | "social" | "professional" | "payment";

export interface CreatorProfile {
  firstName: string;
  lastName: string;
  bio: string;
  profileImage: string | null;
  instagram: string;
  website?: string; // Only this field is optional
  creatorType: string;
  skills: string[];
  location: string;
}