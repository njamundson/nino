import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from "react-router-dom";
import { BrandProfile, UserProfile } from '../UserMenu';

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

        if (!brandData) {
          console.log('No brand profile found');
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
          profile_image_url: profileImageUrl,
          display_name: brandData?.company_name || '',
        } as BrandProfile;
      }
      
      // For creators, fetch from creators table
      const { data: creatorData, error: creatorError } = await supabase
        .from('creators')
        .select('profile_image_url, display_name')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (creatorError) {
        console.error('Error fetching creator profile:', creatorError);
        return null;
      }

      if (!creatorData) {
        console.log('No creator profile found');
        return null;
      }
      
      return {
        id: user.id,
        display_name: creatorData?.display_name || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        profile_image_url: creatorData?.profile_image_url || null,
      } as UserProfile;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};