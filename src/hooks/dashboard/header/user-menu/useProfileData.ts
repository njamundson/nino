import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from "react-router-dom";
import { BrandSettings } from '@/types/brand';
import { UserProfile } from '@/types/user';

export const useProfileData = () => {
  const location = useLocation();
  const isBrandDashboard = location.pathname.startsWith("/brand");

  return useQuery<BrandSettings | UserProfile | null>({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      if (isBrandDashboard) {
        const { data: brandData, error: brandError } = await supabase
          .from('brands')
          .select('*, company_name, profile_image_url')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (brandError || !brandData) {
          console.error('Error fetching brand profile:', brandError);
          return null;
        }

        let profileImageUrl = brandData.profile_image_url;
        if (profileImageUrl) {
          const { data: { publicUrl } } = supabase
            .storage
            .from('profile-images')
            .getPublicUrl(profileImageUrl);
          profileImageUrl = publicUrl;
        }
        
        return {
          ...brandData,
          profile_image_url: profileImageUrl,
          display_name: brandData.company_name || 'Brand',
        } as BrandSettings;
      }
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*, creators!inner(display_name, first_name, last_name)')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileError || !profileData) {
        console.error('Error fetching profile:', profileError);
        return null;
      }
      
      return {
        ...profileData,
        display_name: profileData.creators?.[0]?.display_name || '',
        first_name: profileData.creators?.[0]?.first_name || '',
        last_name: profileData.creators?.[0]?.last_name || '',
      } as UserProfile;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};