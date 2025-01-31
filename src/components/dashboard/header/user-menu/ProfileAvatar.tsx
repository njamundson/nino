import { memo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BrandProfile, UserProfile } from '../UserMenu';

interface ProfileAvatarProps {
  profile: BrandProfile | UserProfile | null;
}

const ProfileAvatar = ({ profile }: ProfileAvatarProps) => {
  const getProfileImage = () => {
    if (!profile) return "";
    return 'profile_image_url' in profile ? profile.profile_image_url || "" : "";
  };

  return (
    <Avatar className="w-10 h-10 ring-2 ring-nino-primary/20 cursor-pointer hover:ring-nino-primary/40 transition-all duration-200">
      <AvatarImage 
        src={getProfileImage()} 
        alt="Profile" 
      />
      <AvatarFallback className="bg-nino-primary text-nino-white">
        {profile?.first_name?.[0]}{profile?.last_name?.[0]}
      </AvatarFallback>
    </Avatar>
  );
};

export default memo(ProfileAvatar);