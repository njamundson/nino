import { Creator, CreatorType } from "@/types/creator";

export const mapCreatorData = (creator: any): Creator => {
  return {
    ...creator,
    profileImage: creator.profile_image_url,
    creatorType: creator.creator_type as CreatorType,
    creator_type: creator.creator_type as CreatorType,
    // Ensure all required properties are present
    bio: creator.bio || null,
    location: creator.location || null,
    specialties: creator.specialties || [],
    instagram: creator.instagram || null,
    website: creator.website || null,
    profile_image_url: creator.profile_image_url || null,
    display_name: creator.display_name || 'Creator'
  };
};