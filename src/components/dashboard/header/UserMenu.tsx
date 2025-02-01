import { memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Settings } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProfileAvatar from "./user-menu/ProfileAvatar";
import { useProfileData } from "./user-menu/useProfileData";

export interface BrandProfile {
  profile_image_url: string | null;
  display_name: string;
}

export interface UserProfile {
  id: string;
  display_name: string;
  created_at: string;
  updated_at: string;
}

const UserMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isBrandDashboard = location.pathname.startsWith("/brand");
  const { data: profile } = useProfileData();

  const handleSettingsClick = () => {
    navigate(isBrandDashboard ? '/brand/settings' : '/creator/settings');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ProfileAvatar profile={profile} />
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 mt-2 bg-white/80 backdrop-blur-xl border-none shadow-lg rounded-xl animate-in fade-in-0 zoom-in-95"
        align="end"
      >
        <DropdownMenuItem 
          className="flex items-center px-4 py-3 text-sm text-nino-text hover:bg-nino-bg/50 rounded-lg mx-1 cursor-pointer transition-colors duration-200"
          onClick={handleSettingsClick}
        >
          <Settings className="w-4 h-4 mr-3 text-nino-gray" />
          Settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default memo(UserMenu);