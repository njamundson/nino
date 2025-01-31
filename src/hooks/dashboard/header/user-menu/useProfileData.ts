import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from "react-router-dom";

export interface UserProfile {
  id: string;
  display_name: string;
  created_at: string;
  updated_at: string;
}

export interface BrandProfile {
  company_name: string;
  profile_image_url: string | null;
}

export const useProfileData = () => {
  const location = useLocation();
  const isBrandDashboard = location.pathname.startsWith("/brand");

  return useQuery<BrandProfile | UserProfile | null>({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

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
        } as BrandProfile;
      }
      
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
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};