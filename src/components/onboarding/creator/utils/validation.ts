import { CreatorProfile } from "@/types/creator";

export const validateBasicInfo = (profile: Pick<CreatorProfile, 'firstName' | 'lastName' | 'bio' | 'location' | 'profileImage'>) => {
  const errors: {[key: string]: string} = {};
  
  if (!profile.firstName.trim()) errors.firstName = "First name is required";
  if (!profile.lastName.trim()) errors.lastName = "Last name is required";
  if (!profile.bio.trim()) errors.bio = "Bio is required";
  if (!profile.location.trim()) errors.location = "Location is required";
  if (!profile.profileImage) errors.profileImage = "Profile image is required";
  
  return errors;
};

export const validateSocialLinks = (profile: Pick<CreatorProfile, 'instagram'>) => {
  const errors: {[key: string]: string} = {};
  
  if (!profile.instagram.trim()) errors.instagram = "Instagram handle is required";
  
  return errors;
};

export const validateProfessionalInfo = (profile: Pick<CreatorProfile, 'creatorType' | 'skills'>) => {
  const errors: {[key: string]: string} = {};
  
  if (!profile.creatorType) errors.creatorType = "Creator type is required";
  if (profile.skills.length === 0) errors.skills = "At least one skill is required";
  
  return errors;
};