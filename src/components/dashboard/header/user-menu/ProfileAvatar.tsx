import { memo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BrandSettings } from '@/types/brand';
import { UserProfile } from '@/types/user';

interface ProfileAvatarProps {
  profile: BrandSettings | UserProfile | null;
}

const ProfileAvatar = ({ profile }: ProfileAvatarProps) => {
  const getProfileImage = () => {
    if (!profile) return "";
    return profile.profile_image_url || "";
  };

  const getInitials = () => {
    if (!profile) return "";
    return `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`;
  };

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage
        src={getProfileImage()}
        alt="Profile" 
      />
      <AvatarFallback className="bg-nino-primary text-nino-white">
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
};

export default memo(ProfileAvatar);