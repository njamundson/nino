import { Creator, CreatorType } from "@/types/creator";

export const mapCreatorData = (creator: any): Creator => {
  return {
    ...creator,
    profileImage: creator.profile_image_url,
    creatorType: creator.creator_type as CreatorType,
    creator_type: creator.creator_type as CreatorType
  };
};