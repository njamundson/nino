import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface BrandProfile {
  company_name: string | null;
  profile_image_url: string | null;
  first_name: string;
  last_name: string;
}

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  updated_at: string;
}

export const UserMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isBrandDashboard = location.pathname.startsWith("/brand");

  const { data: profile } = useQuery<BrandProfile | UserProfile | null>({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // If it's a brand dashboard, fetch brand profile
      if (isBrandDashboard) {
        const { data: brandData, error: brandError } = await supabase
          .from('brands')
          .select('profile_image_url, company_name')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (brandError) {
          console.error('Error fetching brand profile:', brandError);
          return null;
        }

        // Get the public URL for the profile image if it exists
        let profileImageUrl = null;
        if (brandData?.profile_image_url) {
          const { data: { publicUrl } } = supabase
            .storage
            .from('profile-images')
            .getPublicUrl(brandData.profile_image_url);
          profileImageUrl = publicUrl;
        }
        
        return {
          ...brandData,
          profile_image_url: profileImageUrl,
          first_name: brandData?.company_name?.charAt(0) || '',
          last_name: brandData?.company_name?.charAt(1) || '',
        } as BrandProfile;
      }
      
      // Otherwise fetch regular profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data as UserProfile;
    }
  });

  const handleSettingsClick = () => {
    if (isBrandDashboard) {
      navigate('/brand/settings');
    } else {
      navigate('/creator/settings');
    }
  };

  const getProfileImage = () => {
    if (!profile) return "";
    return 'profile_image_url' in profile ? profile.profile_image_url || "" : "";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="w-10 h-10 ring-2 ring-nino-primary/20 cursor-pointer hover:ring-nino-primary/40 transition-all duration-200">
          <AvatarImage 
            src={getProfileImage()} 
            alt="Profile" 
          />
          <AvatarFallback className="bg-nino-primary text-nino-white">
            {profile?.first_name?.[0]}{profile?.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
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